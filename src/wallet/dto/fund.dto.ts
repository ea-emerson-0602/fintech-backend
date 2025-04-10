// wallet/dto/fund.dto.ts
import { IsNumber, Min } from 'class-validator';

export class FundDto {
  @IsNumber()
  @Min(1)
  amount: number;
}
