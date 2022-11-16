import { ApiProperty } from '@nestjs/swagger';

export class InvestDto {
  @ApiProperty({ description: 'Withdraw amount' })
  invest: number;
}
