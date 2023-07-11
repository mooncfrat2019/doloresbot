export const config = {
  BOT_TOKEN: process.env.COMM_TOKEN,
  bot_secret: process.env.BOT_SECRET,
  mysql_config: {
    host: process.env.DBHOST,
    user:  process.env.DBLOGIN,
    password:  process.env.DBPASS,
    database: process.env.DBNAME,
    port: process.env.DBPORT,
    charset : 'utf8mb4'
  },
}