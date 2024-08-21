import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Provider } from '@entities';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Provider]), ConfigModule],
  providers: [MailerService],
  controllers: [MailerController],
  exports: [MailerService],
})
export class MailerModule {}
