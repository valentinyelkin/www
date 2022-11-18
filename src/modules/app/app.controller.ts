import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UserDto } from '../auth/dto/user.dto';

@ApiTags('User account')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User profile' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @ApiResponse({
    type: UserDto,
  })
  @Roles(Role.ADMIN, Role.USER, Role.INVESTOR)
  getProfile(@Request() req) {
    return this.authService.validateUser(req.user);
  }
}
