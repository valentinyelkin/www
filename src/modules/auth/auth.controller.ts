import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OperationDto } from './dto/operation.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: OperationDto,
    description: 'Example sign-up new user.',
    examples: {
      no_invite: {
        summary: 'No Invite',
        description: 'When you dont have invite code',
        value: {
          email: 'useremail@gmail.com',
          password: 'password',
        } as CreateAuthDto,
      },
      have_invite: {
        summary: 'Have invite',
        description: 'when you have invite code',
        value: {
          email: 'useremail@gmail.com',
          password: 'password',
          invite: 'inv-fromuser@gmail.com',
        } as CreateAuthDto,
      },
    },
  })
  @ApiOperation({ summary: 'Create new user and sign-in' })
  @Post('sign-up')
  async register(@Body() body: CreateAuthDto) {
    return await this.authService.createUser(body);
  }

  @ApiBody({
    type: OperationDto,
    description: 'Example user login.',
    examples: {
      user_login: {
        value: {
          email: 'user@email@gmail.com',
          password: 'password',
        } as CreateAuthDto,
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }
}
