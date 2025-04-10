// src/transactions/dto/create-transaction.dto.ts
import { IsEnum, IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  // For transfers only
  @IsString()
  @IsOptional()
  receiverId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  email: string;
}