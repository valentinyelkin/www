import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Users } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessages } from '../../common/constants/error.messages';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    public readonly usersRepository: Repository<Users>,
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

  async login(userDTO: Omit<CreateAuthDto, 'invite'>) {
    const user = await this.validateUser(userDTO);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = bcrypt.compareSync(userDTO.password, user.password);

    if (!isValid) {
      throw new NotFoundException(ErrorMessages.INVALID_CRED);
    }

    return {
      access_token: this.generateToken(user),
    };
  }

  async createUser(body: CreateAuthDto): Promise<Record<string, any>> {
    if (!body.password) {
      throw new HttpException(
        ErrorMessages.WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
    const findUser = await this.validateUser(body);

    if (findUser) {
      throw new HttpException(
        ErrorMessages.EMAIL_ALREADY_IN_USE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(body.password, 5);
    const userInviteId = await this.findUserByInvite(body.invite);

    const user = await this.usersRepository.create({
      ...body,
      password: hashPassword,
      invite_from: userInviteId || null,
    });

    await this.usersRepository.save(user);

    return {
      access_token: this.generateToken(user),
    };
  }

  private generateToken(user: Users) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
