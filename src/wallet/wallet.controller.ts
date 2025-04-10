// src/transactions/transactions.controller.ts
import { Controller, Get, Post, Req, Body, Request, UseGuards } from '@nestjs/common';
import { TransactionsService } from './wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { TransferDto } from './dto/transfer.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('wallet/fund')
async deposit(@Body() createTransactionDto: CreateTransactionDto) {
  createTransactionDto.type = TransactionType.DEPOSIT;
  return this.transactionsService.deposit(createTransactionDto.email, createTransactionDto);
}


  @Post('wallet/withdraw')
  async withdraw(@Req() req, @Body() createTransactionDto: CreateTransactionDto) {
    createTransactionDto.type = TransactionType.WITHDRAWAL;
    return this.transactionsService.withdraw(createTransactionDto.email, createTransactionDto);
  }

  @Post('wallet/transfer')
  @ApiOperation({ summary: 'Transfer funds between two users' })
  @ApiBody({ type: TransferDto })  // This will generate a schema for TransferDto in Swagger UI
  @ApiResponse({
    status: 200,
    description: 'Transfer successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - insufficient funds or invalid transfer details',
  })
  async transfer(@Body() transferDto: TransferDto) {
    return this.transactionsService.transfer(transferDto.email, transferDto);
  }


@Get('transactions')
async getTransactions(@Body() requestBody: { email: string }) {
  return this.transactionsService.getTransactions(requestBody.email);
}

}