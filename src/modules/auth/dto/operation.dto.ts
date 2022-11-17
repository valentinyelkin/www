import { ApiProperty } from '@nestjs/swagger';

export class OperationDto {
  @ApiProperty({ description: 'Withdraw amount' })
  amount: number;
}
