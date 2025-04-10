// src/transactions/dto/transaction-response.dto.ts
import { TransactionType } from '../enums/transaction-type.enum';

export class TransactionResponseDto {
  id: string;
  amount: number;
  type: TransactionType;
  timestamp: Date;
  receiverId?: string;
  description?: string;
  balance: number;
}