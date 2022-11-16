import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './startegy/jwt.strategy';
import { WalletController } from '../wallet/wallet.controller';
import { WalletService } from '../wallet/wallet.service';

@Module({
  controllers: [AuthController, WalletController],
  providers: [AuthService, LocalStrategy, JwtStrategy, WalletService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: { expiresIn: '32160s' },
    }),
    TypeOrmModule.forFeature([Users]),
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
