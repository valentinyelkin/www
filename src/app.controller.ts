import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/startegy/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/decorator/roles.decorator';
import { UserRoles } from './common/enums/roles.enum';
import { RolesGuard } from './auth/roles/roles.guard';

@ApiTags('User account')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @Roles(UserRoles.ADMIN, UserRoles.USER, UserRoles.INVESTOR)
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user);
  }
}
