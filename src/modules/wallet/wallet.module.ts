import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [WalletController],
  providers: [WalletController],
  imports: [UsersModule],
})
export class WalletModule {}
