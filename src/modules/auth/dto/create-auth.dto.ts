import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: 'The user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'The user invite code' })
  @IsOptional()
  invite: string;
}
