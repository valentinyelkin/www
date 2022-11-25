import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ErrorMessages } from '../../common/constants/error.messages';
import { UsersService } from '../users/users.service';
import { Users } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  generateToken(user: Users) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async login(userDTO: Omit<CreateAuthDto, 'invite'>) {
    const user = await this.userService.validateUser(userDTO);

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
    const findUser = await this.userService.validateUser(body);

    if (findUser) {
      throw new HttpException(
        ErrorMessages.EMAIL_ALREADY_IN_USE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(body.password, 5);
    const userInviteId = await this.userService.findUserByInvite(body.invite);

    const user = await this.userService.createUser(
      body,
      hashPassword,
      userInviteId,
    );

    return {
      access_token: this.generateToken(user),
    };
  }
}
