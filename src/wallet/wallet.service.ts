import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from '../auth/auth.service';
import { IsNull, MoreThan, Not } from 'typeorm';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly authService: AuthService) {}

  async findUserById(id) {
    const user = await this.authService.usersRepository.findOneBy({
      id: +id,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }
  async invest(
    id: string,
    body: { invest: number },
  ): Promise<Record<string, any>> {
    if (body.invest < 0) {
      throw new HttpException(
        'Balance can`t be negative',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.findUserById(id);

    const coffee = {
      ...user,
      id: +id,
      balance: user.balance + body.invest,
      role: 'investor',
    };

    return this.authService.usersRepository.save(coffee);
  }

  async withdraw(
    id: string,
    body: { withdraw: number },
  ): Promise<Record<string, any>> {
    const user = await this.findUserById(id);

    if (body.withdraw > user.total_profit) {
      throw new HttpException(
        'Not enough money in the bonus account.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedProfit = {
      ...user,
      id: +id,
      total_profit: user.total_profit - body.withdraw,
      role: 'investor',
    };

    return this.authService.usersRepository.save(updatedProfit);
  }

  @Cron('0 0 * * *', {
    timeZone: 'Europe/Kiev',
  })
  async walletPercent() {
    const walletsWithDeposits = await this.authService.usersRepository.find({
      where: {
        role: 'investor',
        balance: MoreThan(0),
      },
    });

    const updatedAmount = walletsWithDeposits.map((wallet) => ({
      ...wallet,
      total_profit:
        wallet.total_profit + (wallet.balance + wallet.total_profit) / 100,
    }));

    await this.authService.usersRepository.save(updatedAmount);

    this.logger.debug('Investor get a bonus - 1 percent of earnings daily');
  }

  @Cron('0 0 * * *', {
    timeZone: 'Europe/Kiev',
  })
  async walletInvitePercent() {
    const walletsWithDeposits = await this.authService.usersRepository.find({
      where: {
        role: 'investor',
        invite_from: Not(IsNull()),
      },
    });

    for (const wallet of walletsWithDeposits) {
      const userBalanceUpdate =
        await this.authService.usersRepository.findOneBy({
          id: wallet.invite_from,
        });

      if (userBalanceUpdate && wallet.balance > 0) {
        const tenPercent = ((wallet.balance + wallet.total_profit) / 100) * 10;

        const updatedAmount = {
          ...userBalanceUpdate,
          total_profit: userBalanceUpdate.total_profit + tenPercent,
        };

        await this.authService.usersRepository.save(updatedAmount);
      }
    }

    this.logger.debug("Get a bonus - 10 percent of invitee's earnings daily");
  }
}
