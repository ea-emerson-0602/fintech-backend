// src/transactions/transactions.controller.ts

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { Transaction } from './transaction.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Get(':userId')
  async getTransactions(@Param('userId') userId: number): Promise<Transaction[]> {
    return this.transactionsService.getTransactions(userId);
  }
}
