import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: 'The user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user password' })
  @IsString()
  password: string;
}
