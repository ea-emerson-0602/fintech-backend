import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class FundWalletDto {
  @ApiProperty({ example: 1000.00, description: 'Amount to fund wallet with' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Initial deposit', description: 'Optional transaction description' })
  description?: string;
}
