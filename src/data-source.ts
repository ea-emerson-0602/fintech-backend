// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Transaction } from './wallet/entities/transaction.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    // port: 3306,
    username: 'root',
    password: 'victoria2000',
    database: 'fintechdb',
  entities: [User, Transaction],
  synchronize: false,
  logging: true,
logger: 'advanced-console',

  // migrations: ['src/migrations/*.ts'],
});