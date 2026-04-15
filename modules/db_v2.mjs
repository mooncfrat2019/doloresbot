import mysql from 'mysql2';
import { config } from "./config.mjs";
import pkg from 'sequelize';
import Redis from "ioredis";
const { Sequelize } = pkg;

const caCertBase64 = config.mysql_config.ca_cert; // base64 строка из переменной окружения
const caCertPEM = Buffer.from(caCertBase64, 'base64').toString('utf8');

export const seq = new Sequelize(
    config.mysql_config.database,
    config.mysql_config.user,
    config.mysql_config.password,
    {
      host: config.mysql_config.host,
      port: config.mysql_config.port,
      dialect: 'mysql',
      charset: 'utf8mb4',
      dialectOptions: {
        ssl: {
          ca: caCertPEM,
          // Если нужно проверить имя хоста
          // rejectUnauthorized: true
        }
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_520_ci'
      },
    }
);

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,

  // опционально, но полезно в проде:
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // backoff
  }
});