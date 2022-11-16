import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/startegy/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

@ApiTags('User account')
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Get profile information')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user);
  }
}
