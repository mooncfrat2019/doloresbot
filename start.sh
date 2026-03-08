#!/bin/sh
# start.sh - Скрипт запуска DoloresBot

# Цвета для вывода (если терминал поддерживает)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🚀 DoloresBot - Starting with PM2"
echo "=================================================="
echo ""

# Выводим информацию о версиях
echo "${BLUE}📦${NC} PM2 version: $(pm2 --version)"
echo "${BLUE}📦${NC} Node version: $(node --version)"
echo ""

# Проверка критических переменных окружения
echo "${YELLOW}🔍${NC} Checking environment variables..."

# Список обязательных переменных
REQUIRED_VARS="COMM_TOKEN DBHOST REDIS_HOST"
MISSING_VARS=""

for VAR in $REQUIRED_VARS; do
    if [ -z "$(eval echo \$$VAR)" ]; then
        MISSING_VARS="$MISSING_VARS $VAR"
    else
        # Показываем звездочками первые символы для токенов (безопасность)
        if [ "$VAR" = "COMM_TOKEN" ] || [ "$VAR" = "COMM_TOKEN1" ] || [ "$VAR" = "COMM_TOKEN2" ] || [ "$VAR" = "BOT_SECRET" ] || [ "$VAR" = "DBPASS" ] || [ "$VAR" = "REDIS_PASSWORD" ]; then
            VALUE=$(eval echo \$$VAR)
            MASKED_VALUE="$(echo $VALUE | cut -c1-4)****"
            echo "   ✅ $VAR=$MASKED_VALUE"
        else
            echo "   ✅ $VAR=$(eval echo \$$VAR)"
        fi
    fi
done

if [ ! -z "$MISSING_VARS" ]; then
    echo ""
    echo "${RED}❌ ERROR: Missing required variables:${NC}$MISSING_VARS"
    echo "   Please set them in .env file or docker-compose.yml"
    exit 1
fi

echo "${GREEN}✅ Environment check passed${NC}"
echo ""

# Показываем все доступные переменные (только имена)
echo "${BLUE}📋${NC} All available environment variables:"
env | cut -d= -f1 | sort | sed 's/^/   /'
echo ""

echo "=================================================="
echo "${GREEN}🟢 Starting processes...${NC}"
echo ""

# Запускаем pm2 в режиме runtime (для Docker)
# --no-daemon держит процесс на переднем плане
# --env production использует секцию env из конфига
exec pm2-runtime start /app/pm2.config.cjs \
    --output /dev/stdout \
    --error /dev/stderr \
    --env production