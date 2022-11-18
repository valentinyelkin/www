import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Role } from '../../common/enums/roles.enum';
import { OperationDto } from '../auth/dto/operation.dto';
import { ErrorMessages } from '../../common/constants/error.messages';
import { MoreThan } from 'typeorm';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class WalletService {
  constructor(private readonly authService: AuthService) {}

  async findUserById(id) {
    const user = await this.authService.usersRepository.findOneBy({
      id: +id,
    });

    if (!user) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return user;
  }

  async getAllInvestors() {
    return await this.authService.usersRepository.find({
      where: {
        role: Role.INVESTOR,
        balance: MoreThan(0),
      },
    });
  }

  async invest(email, id: string, body: OperationDto): Promise<string> {
    if (body.amount < 0 || !body.amount) {
      throw new ConflictException(ErrorMessages.WRONG_DATA);
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

    return JSON.parse(
      JSON.stringify({
        status: 201,
        msg: `You successfully invest: ${body.amount}`,
        balance: updateBalance,
      }),
    );
  }

  async withdraw(
    id: string,
    body: { amount: number },
  ): Promise<Record<string, any>> {
    const user = await this.findUserById(id);

    const newBalance = user.balance - body.amount;

    await this.authService.usersRepository.update(user.id, {
      balance: newBalance,
    });

    return JSON.parse(
      JSON.stringify({
        status: 201,
        msg: `You successfully withdraw: ${body.amount}`,
        balance: newBalance,
      }),
    );
  }

  async status(): Promise<StatusDto> {
    const allUsers = await this.authService.usersRepository.find();
    let statistic = {
      total_users: 0,
      total_balance: 0,
      total_investors: 0,
      total_inviters: 0,
    };

    if (!allUsers) {
      throw new NotFoundException();
    }

    allUsers.map(async (user) => {
      statistic = {
        ...statistic,
        total_balance: statistic.total_balance + user.balance,
        total_investors:
          user.role === 'investor'
            ? statistic.total_investors + 1
            : statistic.total_investors,
        total_inviters: user.invite_from
          ? statistic.total_inviters + 1
          : statistic.total_inviters,
      };
    });

    return {
      ...statistic,
      total_users: allUsers.length,
    };
  }

  async withdrawByAll(body: { amount: number }): Promise<string> {
    let { amount } = body;
    const withdrawInStart = amount;

    const allInvestors = await this.authService.usersRepository.find({
      where: {
        role: Role.INVESTOR,
      },
    });

    const investorsBalance = allInvestors.reduce(
      (suma, user) => suma + user.balance,
      0,
    );

    if (investorsBalance < amount) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USERS);
    }

    allInvestors.map(async (user) => {
      const { balance, id } = user;

      if (amount === 0) {
        return user;
      }
      if (amount >= balance) {
        amount = amount - balance;
        await this.withdraw(`${id}`, { amount: balance });
      } else if (amount > 0) {
        await this.withdraw(`${id}`, { amount });
        amount = 0;
      }
    });

    return JSON.parse(
      JSON.stringify({
        status: 201,
        msg: `You successfully withdraw: ${withdrawInStart}`,
      }),
    );
  }
}
