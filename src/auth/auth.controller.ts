import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './startegy/local-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: 'Create new user and sign-in' })
  @Post('sign-up')
  async register(@Body() body: CreateAuthDto) {
    return await this.authService.createUser(body);
  }
}
