import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 'recipient@example.com', description: 'Email of the recipient' })
  @IsEmail()
  recipientEmail: string;

  @ApiProperty({ example: 200.00, description: 'Amount to transfer' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Payment for services', description: 'Optional transaction description' })
  description?: string;
}
