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

@ApiTags('Wallet operations')
@Controller('wallet')
export class WalletController {
  constructor(private readonly authService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/invest')
  async invest(@Request() req, @Body() body: any) {
    const userId = req.user.id;
    const userEmail = req.user.email;
    return await this.authService.invest(userEmail, userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/withdraw')
  async withdraw(@Request() req, @Body() body: any) {
    const userId = req.user.id;

    return await this.authService.withdraw(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/take_all')
  async withdrawById(@Body() body: any) {
    return await this.authService.withdrawByAll(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/status')
  async status() {
    return await this.authService.status();
  }
}
