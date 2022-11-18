import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../common/enums/roles.enum';

export class UserDto {
  @ApiProperty({ description: 'User email', uniqueItems: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', nullable: false })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User role', default: Role.USER })
  @IsOptional()
  role: string;

  @ApiProperty({ description: 'User balance', default: 0 })
  @IsOptional()
  balance: number;

  @ApiProperty({ description: 'User invite code', default: null })
  @IsOptional()
  invite_code: string;

  @ApiProperty({ description: 'Who invited this user' })
  @IsOptional()
  invite_from: number;
}
