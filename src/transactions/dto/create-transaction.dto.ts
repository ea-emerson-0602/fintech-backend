// src/transactions/dto/create-transaction.dto.ts
import { IsEnum, IsNumber, IsOptional, IsString, IsEmail } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsEmail()
  receiverEmail?: string;  // Now using receiverEmail instead of receiverId

  @IsOptional()
  @IsString()
  note?: string;
}
