// src/wallet/wallet.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './wallet.service';
import { TransactionsController } from './wallet.controller';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity'; // Assuming you have a User entity

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class WalletModule {}
