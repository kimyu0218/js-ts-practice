import { Model, ModelStatic, Sequelize } from 'sequelize';

export const sequelize =
  process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite:', { logging: false })
    : new Sequelize({
        database: process.env.MYSQL_DATABASE || 'express_practice',
        dialect: 'mysql',
        username: process.env.MYSQL_USERNAME || 'root',
        host: process.env.MYSQL_HOST || 'localhost',
        port: (process.env.MYSQL_PORT as unknown as number) || 3306,
        pool: {
          max: 5,
          min: 0,
          acquire: 10000,
          idle: 10000,
        },
        timezone: '+09:00',
        isolationLevel: 'REPEATABLE_READ',
      });

export async function initTestDatabase() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
}

export async function clearTestDatabase() {
  return Promise.all(
    Object.values(sequelize.models).map((model: ModelStatic<Model>) => model.destroy({ truncate: true }))
  );
}

export async function closeTestDatabase() {
  await sequelize.close();
}
