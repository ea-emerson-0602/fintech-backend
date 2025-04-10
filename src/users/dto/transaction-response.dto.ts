import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({ example: 'txn_12345' })
  id: string;

  @ApiProperty({ example: 250.00 })
  amount: number;

  @ApiProperty({ example: 'fund', enum: ['fund', 'withdraw', 'transfer'] })
  type: 'fund' | 'withdraw' | 'transfer';

  @ApiProperty({ example: '2024-04-10T10:45:00Z' })
  timestamp: Date;

  @ApiProperty({ example: 'Top-up from bank' })
  description: string | null;

  @ApiProperty({ example: 750.00 })
  balance: number;
}
