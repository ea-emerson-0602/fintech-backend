// src/transactions/dto/create-transaction.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  receiverId?: number;
}
