import { ApiProperty } from '@nestjs/swagger';

export class StatusDto {
  @ApiProperty({ description: 'Total balance. include admin balance to' })
  total_balance: number;

  @ApiProperty({ description: 'All investors' })
  total_investors: number;

  @ApiProperty({ description: 'All users' })
  total_users: number;

  @ApiProperty({ description: 'All users' })
  total_inviters: number;
}
