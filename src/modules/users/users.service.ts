import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorMessages } from '../../common/constants/error.messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async validateUser(body: { password: string; email: string }) {
    const user = await this.usersRepository.findOneBy({
      email: body.email,
    });

    if (user) {
      return user;
    }

    return null;
  }

  async findUserByInvite(invite): Promise<number> {
    const userWhoInvite =
      invite &&
      (await this.usersRepository.findOneBy({
        invite_code: invite,
      }));

    if (invite && !userWhoInvite) {
      throw new HttpException(
        ErrorMessages.WRONG_INVITE_CODE,
        HttpStatus.BAD_REQUEST,
      );
    }

    return userWhoInvite.id;
  }

  async createUser(body, password, userInviteId) {
    const newUser = this.usersRepository.create({
      ...body,
      password,
      invite_from: userInviteId || null,
    });
    await this.usersRepository.save(newUser);

    return this.validateUser({ password, email: body.email });
  }

  async updateById(id, entity) {
    await this.usersRepository.update(id, {
      ...entity,
    });
  }

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findWhere(where): Promise<Users[]> {
    return await this.usersRepository.find({ ...where });
  }
  async findOneBy(where) {
    return await this.usersRepository.findOneBy({ ...where });
  }
}
