import {
  Body,
  Controller,
  Get,
  Post, Query,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RolesGuard } from '../auth/roles/roles.guard';
import { OperationDto } from '../auth/dto/operation.dto';
import { StatusDto } from './dto/status.dto';

@ApiTags('Wallet operations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly authService: WalletService) {}

  @ApiOperation({ summary: 'Invest money' })
  @ApiBody({
    type: OperationDto,
    description: 'Example for invest.',
    examples: {
      a: {
        summary: 'Request Body',
        value: { amount: 1000 } as OperationDto,
      },
    },
  })
  @Post('/invest')
  @Roles(Role.ADMIN, Role.USER, Role.INVESTOR)
  async invest(@Request() req, @Body() body: any) {
    const userId = req.user.id;
    const userEmail = req.user.email;
    return await this.authService.invest(userEmail, userId, body);
  }

  @ApiOperation({ summary: 'Withdraw money' })
  @ApiBody({
    type: OperationDto,
    description: 'Example for withdraw.',
    examples: {
      a: {
        summary: 'Request Body',
        value: { amount: 1000 } as OperationDto,
      },
    },
  })
  @Post('/withdraw')
  @Roles(Role.INVESTOR, Role.ADMIN)
  async withdraw(@Request() req, @Body() body: any) {
    const userId = req.user.id;

    return await this.authService.withdraw(userId, body);
  }

  @ApiOperation({ summary: 'Withdraw any count money: only for ADMIN role' })
  @ApiBody({
    type: OperationDto,
    description: 'Example for withdraw.',
    examples: {
      a: {
        summary: 'Request Body',
        value: { amount: 1000 } as OperationDto,
      },
    },
  })
  @Post('/take_all')
  @Roles(Role.ADMIN)
  async withdrawByAll(@Body() body: any) {
    return await this.authService.withdrawByAll(body);
  }

  @ApiResponse({
    type: StatusDto,
  })
  @ApiOperation({ summary: 'ADMIN can see current status' })
  @Get('/status')
  @Roles(Role.ADMIN)
  @Render('index')
  async status() {
    return await this.authService.status();
  }
}
