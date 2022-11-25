import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UserDto } from '../auth/dto/user.dto';
import { UsersService } from '../users/users.service';

@ApiTags('User account')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly findWhere: UsersService) {}

  @ApiOperation({ summary: 'User profile' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @ApiResponse({
    type: UserDto,
  })
  @Roles(Role.ADMIN, Role.USER, Role.INVESTOR)
  getProfile(@Request() req) {
    return this.findWhere.validateUser(req.user);
  }
}
