import { Account } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MailerModule } from '../mailer';
import { AccountSubscriber } from './account.subscriber';
import { ProviderModule } from '../provider';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), MailerModule, ProviderModule],
  controllers: [AccountController],
  providers: [AccountService, AccountSubscriber],
  exports: [AccountService],
})
export class AccountModule {}
