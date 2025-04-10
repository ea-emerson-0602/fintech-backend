// wallet/dto/withdraw.dto.ts
import { IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @IsNumber()
  @Min(1)
  amount: number;
}
