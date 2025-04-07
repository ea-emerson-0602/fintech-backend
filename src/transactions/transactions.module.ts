// src/transactions/transactions.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../users/user.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
