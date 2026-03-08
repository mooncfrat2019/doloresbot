FROM node:18-alpine

# Устанавливаем pm2 глобально
RUN npm install -g pm2 --silent

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости проекта
RUN yarn install --frozen-lockfile --production

# Копируем конфигурационные файлы
COPY pm2.config.cjs ./
COPY start.sh ./

# Копируем исходный код
COPY main.mjs ./
COPY cron.mjs ./
COPY modules/ ./modules/
COPY controllers/ ./controllers/
COPY blocks/ ./blocks/

# Делаем скрипт запуска исполняемым
RUN chmod +x /app/start.sh

# Проверяем, что все необходимые файлы на месте
RUN ls -la && \
    echo "✅ Files copied successfully"

# Указываем порт (если бот использует веб-сервер)
EXPOSE 7000

# Запускаем скрипт
CMD ["/app/start.sh"]