import {
  Body,
  Controller,
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
    return await this.authService.invest(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/withdraw')
  async withdraw(@Request() req, @Body() body: any) {
    const userId = req.user.id;

    return await this.authService.withdraw(userId, body);
  }
}
