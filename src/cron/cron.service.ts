import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Role } from '../common/enums/roles.enum';
import { IsNull, MoreThan, Not } from 'typeorm';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly authService: AuthService) {}

  async purchaseOnePercent() {
    const walletsWithDeposits = await this.authService.usersRepository.find({
      where: {
        role: Role.INVESTOR,
        balance: MoreThan(0),
      },
    });

    for (const wallet of walletsWithDeposits) {
      await this.authService.usersRepository.update(wallet.id, {
        balance: wallet.balance + wallet.balance / 100,
      });
    }

    this.logger.debug('Investor get a bonus - 1 percent of earnings daily');
  }

  async walletInvitePercent() {
    const walletsWithDeposits = await this.authService.usersRepository.find({
      where: {
        role: Role.INVESTOR,
        invite_from: Not(IsNull()),
      },
    });

    const updatedBalance = [];

    for (const wallet of walletsWithDeposits) {
      const userBalanceUpdate =
        await this.authService.usersRepository.findOneBy({
          id: wallet.invite_from,
        });

      if (userBalanceUpdate && wallet.balance > 0) {
        const dailyBonus = wallet.balance / 101;
        const tenPercent = (dailyBonus / 100) * 10;

        const updatedAmount = {
          ...userBalanceUpdate,
          balance: userBalanceUpdate.balance + tenPercent,
        };
        updatedBalance.push(updatedAmount);
      }
      await this.authService.usersRepository.save(updatedBalance);
    }
    this.logger.debug("Get a bonus - 10 percent of invitee's earnings daily");
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'Europe/Kiev',
  })
  async walletPercent() {
    await this.purchaseOnePercent();
    await this.walletInvitePercent();
  }
}
