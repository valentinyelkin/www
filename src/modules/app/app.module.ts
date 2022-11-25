import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { LoggerService } from '../../logger/logger.service';
import { LoggerModule } from '../../logger/logger.module';
import appConfig from '../../config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    LoggerModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [LoggerService],
})
export class AppModule {}
