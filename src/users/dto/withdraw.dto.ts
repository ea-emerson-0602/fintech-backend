import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 500.00, description: 'Amount to withdraw' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'ATM withdrawal', description: 'Optional transaction description' })
  description?: string;
}
