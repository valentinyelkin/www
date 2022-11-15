import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './startegy/local-auth.guard';
import { JwtAuthGuard } from './startegy/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async invest(@Param('id') id: string, @Body() body: any) {
    return await this.authService.invest(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user, 'req');
    return req.user;
  }
}
