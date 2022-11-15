import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './startegy/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  @Post('sign-up')
  async register(@Body() body: CreateAuthDto) {
    return await this.authService.createUser(body);
  }
}
