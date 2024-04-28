import pkg from 'sequelize';
const { DataTypes } = pkg;
import { seq } from './db_v2.mjs';

export const pills_data = seq.define('pills_data', {
  id: {
    type: DataTypes.MEDIUMINT(),
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER()
  },
  title: {
    type: DataTypes.STRING({ length: 200 })
  },
  time: {
    type: DataTypes.STRING({ length: 50 })
  },
  count: {
    type: DataTypes.INTEGER()
  },
}, { timestamps: false });

export const bot_users = seq.define('bot_users', {
  id: {
    type: DataTypes.MEDIUMINT(),
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER()
  },
  current_pill_id: {
    type: DataTypes.INTEGER(),
    defaultValue: 0,
  },
  state: {
    type: DataTypes.INTEGER(),
    defaultValue: 0,
  },
  is_messages_allowed: {
    type: DataTypes.INTEGER(),
    defaultValue: 1,
  },
}, { timestamps: false });
