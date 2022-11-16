import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ description: 'Withdraw amount' })
  withdraw: number;
}
