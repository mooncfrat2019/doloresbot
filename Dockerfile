# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем pm2 глобально через npm (он уже есть в образе)
# Флаг -g означает глобальную установку, --silent подавляет лишний вывод
RUN npm install -g pm2 --silent

# Создаем директорию для приложения
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости проекта
RUN yarn install --frozen-lockfile --production

# Копируем исходный код
COPY . .

# Создаем конфигурацию pm2
RUN echo 'module.exports = {\n\
  apps: [{\n\
    name: "main",              // Имя процесса для идентификации\n\
    script: "./main.mjs",      // Путь к скрипту\n\
    instances: 1,              // Количество экземпляров\n\
    exec_mode: "fork",         // Режим запуска (fork для скриптов)\n\
    watch: false,              // Не следить за изменениями файлов\n\
    // НАСТРОЙКА ЛОГОВ - теперь они будут в консоль Docker\n\
    error_file: "/dev/stderr", // Ошибки отправляются в stderr контейнера\n\
    out_file: "/dev/stdout",   // Обычные логи в stdout контейнера\n\
    log_file: "/dev/stdout",   // Все логи в stdout\n\
    merge_logs: true,          // Объединять логи в один поток\n\
    log_date_format: "YYYY-MM-DD HH:mm:ss", // Формат даты в логах\n\
    // ПЕРЕДАЧА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ\n\
    env: {\n\
      // Эти переменные будут доступны процессу\n\
      // Они наследуются из переменных контейнера\n\
      NODE_ENV: "production",\n\
      // Все остальные переменные (COMM_TOKEN, DBHOST и т.д.)\n\
      // автоматически передаются из контейнера в процесс\n\
    }\n\
  }, {\n\
    name: "cron",\n\
    script: "./cron.mjs",\n\
    instances: 1,\n\
    exec_mode: "fork",\n\
    watch: false,\n\
    error_file: "/dev/stderr",\n\
    out_file: "/dev/stdout",\n\
    log_file: "/dev/stdout",\n\
    merge_logs: true,\n\
    log_date_format: "YYYY-MM-DD HH:mm:ss",\n\
    env: {\n\
      NODE_ENV: "production",\n\
    }\n\
  }]\n\
}' > /app/pm2.config.cjs

# Создаем скрипт запуска с проверкой переменных
RUN echo '#!/bin/sh\n\
echo "=================================================="\n\
echo "🚀 DoloresBot - Starting with PM2"\n\
echo "=================================================="\n\
\n\
# Выводим информацию о версиях\n\
echo "📦 PM2 version: $(pm2 --version)"\n\
echo "📦 Node version: $(node --version)"\n\
\n\
# Проверка критических переменных окружения\n\
echo "🔍 Checking environment variables..."\n\
REQUIRED_VARS="COMM_TOKEN DBHOST REDIS_HOST"\n\
MISSING_VARS=""\n\
\n\
for VAR in $REQUIRED_VARS; do\n\
    if [ -z "$(eval echo \$$VAR)" ]; then\n\
        MISSING_VARS="$MISSING_VARS $VAR"\n\
    fi\n\
done\n\
\n\
if [ ! -z "$MISSING_VARS" ]; then\n\
    echo "❌ ERROR: Missing required variables:$MISSING_VARS"\n\
    exit 1\n\
fi\n\
\n\
echo "✅ Environment check passed"\n\
\n\
# Выводим список всех переданных переменных (без значений для безопасности)\n\
echo "📋 Available environment variables:"\n\
env | cut -d= -f1 | sort | sed "s/^/   /"\n\
\n\
echo "=================================================="\n\
echo "🟢 Starting processes..."\n\
\n\
# Запускаем pm2 в режиме runtime (для Docker)\n\
# --output и --error перенаправляют логи в stdout/stderr\n\
# --no-daemon держит процесс на переднем плане\n\
# --env production использует секцию env из конфига\n\
exec pm2-runtime start /app/pm2.config.cjs \\\n\
    --output /dev/stdout \\\n\
    --error /dev/stderr \\\n\
    --env production\n\
\n\
# exec заменяет текущий процесс на pm2, поэтому код после exec не выполняется' > /app/start.sh && chmod +x /app/start.sh

# Указываем, что контейнер будет слушать порт 3000
EXPOSE 7000

# Запускаем скрипт
CMD ["/app/start.sh"]