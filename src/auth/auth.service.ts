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
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    public readonly usersRepository: Repository<Users>,
  ) {}

  async login(userDTO: CreateAuthDto) {
    const user = await this.validateUser(userDTO);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = bcrypt.compareSync(userDTO.password, user.password);

    if (!isValid) {
      throw new NotFoundException(`Invalid credentials`);
    }
    return {
      access_token: this.generateToken(user),
    };
  }

  async createUser(body: CreateAuthDto): Promise<Record<string, any>> {
    const findUser = await this.validateUser(body);

    if (findUser) {
      throw new HttpException('email already in use', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(body.password, 5);

    // INVITE LOGIC
    let userWhoInvite =
      body?.invite &&
      (await this.usersRepository.findOneBy({
        invite_code: body.invite,
      }));

    if (body?.invite && !userWhoInvite) {
      throw new HttpException('WRONG INVITE CODE', HttpStatus.BAD_REQUEST);
    }

    if (userWhoInvite) {
      userWhoInvite = {
        ...userWhoInvite,
        invite_code: body.invite,
      };

      userWhoInvite && (await this.usersRepository.save(userWhoInvite));
    }

    const user = await this.usersRepository.create({
      ...body,
      password: hashPassword,
      invite_code: `inv-${body.email}`,
      balance: 0,
      role: 'user',
      invite_from: userWhoInvite?.id || null,
    });

    return await this.usersRepository.save(user);
  }

  async validateUser(body: { password: string; email: string }) {
    const user = await this.usersRepository.findOneBy({
      email: body.email,
    });

    if (user) {
      return user;
    }

    return null;
  }

  private generateToken(user: Users) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
