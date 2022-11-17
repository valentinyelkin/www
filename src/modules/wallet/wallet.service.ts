import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Role } from '../../common/enums/roles.enum';
import { OperationDto } from '../auth/dto/operation.dto';

@Injectable()
export class WalletService {
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

  async invest(email, id: string, body: OperationDto): Promise<string> {
    if (body.amount < 0 || !body.amount) {
      throw new ConflictException('Wrong data');
    }

    const user = await this.findUserById(id);

    const updateBalance = user?.balance
      ? user?.balance + body.amount
      : body.amount;
    const updateRole = user.role === Role.ADMIN ? Role.ADMIN : Role.INVESTOR;

    await this.authService.usersRepository.update(user.id, {
      invite_code: `inv-${email}`,
      balance: updateBalance,
      role: updateRole,
    });
    return `You successfully invest: ${body.amount}`;
  }

  async withdraw(
    id: string,
    body: { amount: number },
  ): Promise<Record<string, any>> {
    const user = await this.findUserById(id);

    if (body.amount > user.balance || !body.amount) {
      throw new BadRequestException('Not enough money in account.');
    }

    const updatedProfit = {
      ...user,
      id: +id,
      balance: user.balance - body.amount,
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

  async withdrawByAll(body: { amount: number }): Promise<string> {
    const allUsers = await this.authService.usersRepository.find({
      where: {
        role: Role.INVESTOR,
      },
    });

    let amount = body.amount;
    const withdrawInStart = amount;

    allUsers.map(async (user) => {
      const balance = user.balance;

      if (amount === 0) {
        return user;
      }
      if (amount >= balance) {
        amount = amount - balance;
        await this.withdraw(`${user.id}`, { amount: balance });
      } else if (amount > 0) {
        amount = amount - balance;
        await this.withdraw(`${user.id}`, { amount });
      }
    });

    if (amount > 0) {
      throw new ConflictException(
        'Withdraw all money, but your wont more then user`s have(',
      );
    }

    return `Withdraw amount: ${withdrawInStart}`;
  }
}
