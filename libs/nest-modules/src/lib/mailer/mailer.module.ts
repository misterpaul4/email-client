import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@entities';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from '../provider';
import { MailerController } from './controller';
import { MailerSmtpService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ConfigModule, ProviderModule],
  providers: [MailerSmtpService],
  controllers: [MailerController],
  exports: [MailerSmtpService],
})
export class MailerModule {}
