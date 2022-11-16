import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/startegy/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRoles } from '../common/enums/roles.enum';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('Wallet operations')
@Controller('wallet')
export class WalletController {
  constructor(private readonly authService: WalletService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/invest')
  @Roles(UserRoles.ADMIN, UserRoles.USER, UserRoles.INVESTOR)
  async invest(@Request() req, @Body() body: any) {
    const userId = req.user.id;
    const userEmail = req.user.email;
    return await this.authService.invest(userEmail, userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/withdraw')
  @Roles(UserRoles.INVESTOR, UserRoles.ADMIN)
  async withdraw(@Request() req, @Body() body: any) {
    const userId = req.user.id;

    return await this.authService.withdraw(userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/take_all')
  @Roles(UserRoles.ADMIN)
  async withdrawById(@Body() body: any) {
    return await this.authService.withdrawByAll(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/status')
  @Roles(UserRoles.ADMIN)
  async status() {
    return await this.authService.status();
  }
}
