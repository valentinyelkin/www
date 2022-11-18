import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Role } from '../common/enums/roles.enum';
import { IsNull, MoreThan, Not } from 'typeorm';
import { AuthService } from '../modules/auth/auth.service';
import {
  getBonusesPercent,
  getTenPercent,
  onePercent,
} from '../common/helpers/wallet.operations';
import { WalletService } from '../modules/wallet/wallet.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly walletService: WalletService,
  ) {}

  async getOnePercent() {
    const walletsWithDeposits = await this.walletService.getAllInvestors();

    for (const wallet of walletsWithDeposits) {
      await this.authService.usersRepository.update(wallet.id, {
        balance: onePercent(wallet.balance),
      });
    }

    this.logger.debug('Investor get a bonus - 1 percent of earnings daily');
  }

  async getTenPercent() {
    const walletsWithDeposits = await this.authService.usersRepository.find({
      where: {
        role: Role.INVESTOR || Role.ADMIN,
        invite_from: Not(IsNull()),
      },
    });

    for (const wallet of walletsWithDeposits) {
      const userBalanceUpdate =
        await this.authService.usersRepository.findOneBy({
          id: wallet.invite_from,
        });

      if (userBalanceUpdate && wallet.balance > 0) {
        const dailyBonus = getBonusesPercent(wallet.balance);
        const tenPercent = getTenPercent(dailyBonus);

        await this.authService.usersRepository.update(userBalanceUpdate.id, {
          balance: userBalanceUpdate.balance + tenPercent,
        });
      }
    }
    this.logger.debug("Get a bonus - 10 percent of invitee's earnings daily");
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Europe/Kiev',
  })
  async walletPercent() {
    await this.getOnePercent();
    await this.getTenPercent();
  }
}
