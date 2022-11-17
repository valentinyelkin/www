import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './modules/auth/startegy/jwt-auth.guard';
import { AuthService } from './modules/auth/auth.service';
import { Roles } from './modules/auth/decorator/roles.decorator';
import { Role } from './common/enums/roles.enum';
import { RolesGuard } from './modules/auth/roles/roles.guard';

@ApiTags('User account')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(Role.ADMIN, Role.USER, Role.INVESTOR)
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user);
  }
}
