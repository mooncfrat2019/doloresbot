import mysql from 'mysql2';
import { config } from "./config.mjs";
import pkg from 'sequelize';
const { Sequelize } = pkg;

export const seq = new Sequelize(config.mysql_config.database, config.mysql_config.user, config.mysql_config.password, {
  host: config.mysql_config.host,
  port: config.mysql_config.port,
  dialect: 'mysql',
  charset: 'utf8mb4',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_520_ci'
  },
});