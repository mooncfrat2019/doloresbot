// pm2.config.cjs
module.exports = {
    apps: [
        {
            name: "main",
            script: "./main.mjs",
            instances: 1,
            exec_mode: "fork",
            watch: false,

            // Настройка логов
            error_file: "/dev/stderr",
            out_file: "/dev/stdout",
            log_file: "/dev/stdout",
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss",

            // Переменные окружения
            env: {
                NODE_ENV: "production"
            }
        },
        {
            name: "cron",
            script: "./cron.mjs",
            instances: 1,
            exec_mode: "fork",
            watch: false,

            // Настройка логов
            error_file: "/dev/stderr",
            out_file: "/dev/stdout",
            log_file: "/dev/stdout",
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss",

            // Переменные окружения
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};