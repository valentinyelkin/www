import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  driver: undefined,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: [join(__dirname, '../seeds/*.{t,j}s')],
  migrationsRun: true,
  synchronize: false,
});
