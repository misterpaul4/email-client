import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@entities';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from '../provider';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ConfigModule, ProviderModule],
  providers: [MailerService],
  controllers: [MailerController],
  exports: [MailerService],
})
export class MailerModule {}
