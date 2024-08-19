import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Provider } from '@entities';
import { MailerController } from './mailer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Provider])],
  providers: [MailerService],
  controllers: [MailerController],
  exports: [MailerService],
})
export class MailerModule {}
