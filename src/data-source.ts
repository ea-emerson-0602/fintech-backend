// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
// import { Transaction } from './wallet/entities/transaction.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    // port: 3306,      
    host: process.env.DB_HOST,
      port: 10862,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
  logging: true,
logger: 'advanced-console',

  // migrations: ['src/migrations/*.ts'],
});