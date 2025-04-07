// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/user.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'K0enigsegg',
      database: 'fintech_db',
      entities: [User, Transaction],
      synchronize: true,
    }),
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
