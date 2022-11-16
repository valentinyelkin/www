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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRoles } from '../common/enums/roles.enum';
import { RolesGuard } from '../auth/roles/roles.guard';
import { WithdrawDto } from '../auth/dto/withdraw.dto';
import { InvestDto } from '../auth/dto/invest.dto';

@ApiTags('Wallet operations')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly authService: WalletService) {}

  @ApiOperation({ summary: 'Invest money' })
  @ApiBody({
    type: InvestDto,
    description: 'Example for invest.',
    examples: {
      a: {
        summary: 'Request Body',
        value: { invest: 1000 } as InvestDto,
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/invest')
  @Roles(UserRoles.ADMIN, UserRoles.USER, UserRoles.INVESTOR)
  async invest(@Request() req, @Body() body: any) {
    const userId = req.user.id;
    const userEmail = req.user.email;
    return await this.authService.invest(userEmail, userId, body);
  }

  @ApiOperation({ summary: 'Withdraw money' })
  @ApiBody({
    type: WithdrawDto,
    description: 'Example for withdraw.',
    examples: {
      a: {
        summary: 'Request Body',
        value: { withdraw: 1000 } as WithdrawDto,
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/withdraw')
   // @Roles(UserRoles.INVESTOR, UserRoles.ADMIN)
  async withdraw(@Request() req, @Body() body: any) {
    const userId = req.user.id;

    return await this.authService.withdraw(userId, body);
  }

  @ApiOperation({ summary: 'Withdraw any count money: only for ADMIN role' })
  @ApiBody({
    type: WithdrawDto,
    description: 'Example for withdraw.',
    examples: {
      a: {
        summary: 'Request Body',
        value: { withdraw: 1000 } as WithdrawDto,
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/take_all')
  @Roles(UserRoles.ADMIN)
  async withdrawById(@Body() body: any) {
    return await this.authService.withdrawByAll(body);
  }
  @ApiOperation({ summary: 'ADMIN can see current status' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/status')
  @Roles(UserRoles.ADMIN)
  async status() {
    return await this.authService.status();
  }
}
