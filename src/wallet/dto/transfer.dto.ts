import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'Email of the sender',
    example: 'sender@example.com',
  })
  email: string;  // Sender email

  @ApiProperty({
    description: 'Amount to transfer',
    example: 1000,
  })
  amount: number;

  @ApiProperty({
    description: 'Email of the receiver',
    example: 'receiver@example.com',
  })
  receiverEmail: string;  // Receiver email

  @ApiProperty({
    description: 'Optional description for the transaction',
    example: 'Payment for services',
    required: false,
  })
  description?: string;
}
