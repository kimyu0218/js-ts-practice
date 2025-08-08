import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  database: 'express-practice',
  dialect: 'mysql',
  username: process.env.MYSQL_USERNAME || 'root',
  host: process.env.MYSQL_HOST || 'localhost',
  port: (process.env.MYSQL_PORT as unknown as number) || 3306,
});
