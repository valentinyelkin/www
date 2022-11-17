import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  driver: undefined,
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: ['src/**/*.entity.ts'],
  migrations: [join(__dirname, '../migrations/*.{t,j}s')],
  migrationsRun: true,
  synchronize: false,
});
