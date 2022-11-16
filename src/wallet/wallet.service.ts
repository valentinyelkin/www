import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from '../auth/auth.service';
import { IsNull, MoreThan, Not } from 'typeorm';
import { UserRoles } from '../common/enums/roles.enum';

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
    email,
    id: string,
    body: { invest: number },
  ): Promise<Record<string, any>> {
    if (body.invest < 0 || !body.invest) {
      throw new ConflictException('Wrong data');
    }

    const user = await this.findUserById(id);

    const coffee = {
      ...user,
      id: +id,
      invite_code: `inv-${email}`,
      balance: user?.balance ? user?.balance + body.invest : body.invest,
      role: UserRoles.INVESTOR,
    };

    return this.authService.usersRepository.save(coffee);
  }

  async withdraw(
    id: string,
    body: { withdraw: number },
  ): Promise<Record<string, any>> {
    const user = await this.findUserById(id);

    console.log(body);

    if (body.withdraw > user.balance || !body.withdraw) {
      throw new BadRequestException('Not enough money in the bonus account.');
    }

    const updatedProfit = {
      ...user,
      id: +id,
      balance: user.balance - body.withdraw,
    };

    return this.authService.usersRepository.save(updatedProfit);
  }

  async status(): Promise<string> {
    const allUsers = await this.authService.usersRepository.find();
    let statistic = {
      total_users: 0,
      total_balance: 0,
      total_investors: 0,
    };

    allUsers.map(async (user) => {
      statistic = {
        ...statistic,
        total_balance: statistic.total_balance + user.balance,
        total_investors:
          user.role === 'investor'
            ? statistic.total_investors + 1
            : statistic.total_investors,
      };
    });

    return JSON.parse(
      JSON.stringify({
        ...statistic,
        total_users: allUsers.length,
      }),
    );
  }

  async withdrawByAll(body: { withdraw: number }): Promise<string> {
    const allUsers = await this.authService.usersRepository.find();
    let withdraw = body.withdraw;
    const withdrawInStart = withdraw;
    allUsers.map(async (user) => {
      const balance = user.balance;

      if (withdraw === 0) {
        return user;
      }
      if (withdraw >= balance) {
        withdraw = withdraw - balance;
        await this.withdraw(`${user.id}`, { withdraw: balance });
      } else if (withdraw > 0) {
        withdraw = withdraw - balance;
        await this.withdraw(`${user.id}`, { withdraw });
      }
    });

    if (withdraw > 0) {
      throw new ConflictException(
        'Withdraw all money, but your wont more then user`s have(',
      );
    }

    return `Withdraw amount: ${withdrawInStart - withdraw}`;
  }

  @Cron('0 0 * * *', {
    timeZone: 'Europe/Kiev',
  })
  async walletPercent() {
    const walletsWithDeposits = await this.authService.usersRepository.find({
      where: {
        role: UserRoles.INVESTOR,
        balance: MoreThan(0),
      },
    });

    const updatedAmount = walletsWithDeposits.map((wallet) => ({
      ...wallet,
      balance: wallet.balance + wallet.balance / 100,
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
        role: UserRoles.INVESTOR,
        invite_from: Not(IsNull()),
      },
    });

    for (const wallet of walletsWithDeposits) {
      const userBalanceUpdate =
        await this.authService.usersRepository.findOneBy({
          id: wallet.invite_from,
        });

      if (userBalanceUpdate && wallet.balance > 0) {
        const tenPercent = (wallet.balance / 100) * 10;

        const updatedAmount = {
          ...userBalanceUpdate,
          balance: userBalanceUpdate.balance + tenPercent,
        };

        await this.authService.usersRepository.save(updatedAmount);
      }
    }

    this.logger.debug("Get a bonus - 10 percent of invitee's earnings daily");
  }
}
