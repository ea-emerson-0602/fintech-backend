// src/transactions/dto/create-transaction.dto.ts

import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../transaction.entity';

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  senderId: number;

  @IsInt()
  @IsOptional()
  receiverId?: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsInt()
  @Min(1)
  amount: number;
}
