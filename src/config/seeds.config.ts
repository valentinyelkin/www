import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  driver: undefined,
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: [join(__dirname, '../seeds/*.{t,j}s')],
  migrationsRun: true,
  synchronize: false,
});
