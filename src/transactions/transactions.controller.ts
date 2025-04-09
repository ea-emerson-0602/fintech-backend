// src/transactions/transactions.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TransactionType } from './entities/transaction.entity';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('fund')
  async fundWallet(@Body() dto: CreateTransactionDto, @Request() req) {
    dto.type = TransactionType.DEPOSIT;
    return this.transactionsService.create(dto, req.user.userId);
  }

  @Post('withdraw')
  async withdraw(@Body() dto: CreateTransactionDto, @Request() req) {
    dto.type = TransactionType.WITHDRAWAL;
    return this.transactionsService.create(dto, req.user.userId);
  }

  @Post('transfer')
  async transfer(@Body() dto: CreateTransactionDto, @Request() req) {
    dto.type = TransactionType.TRANSFER;
    return this.transactionsService.create(dto, req.user.userId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.transactionsService.findAll(req.user.userId);
  }
}
