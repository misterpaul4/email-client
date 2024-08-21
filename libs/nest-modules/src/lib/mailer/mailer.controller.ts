import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from '@interfaces';

@Controller('mailer')
export class MailerController {
  constructor(private service: MailerService) {}

  @Post('send-mail')
  sendMail(@Body() dto: SendMailDto) {
    return this.service.sendEmail(dto);
  }

  @Get('default-account')
  getDefaultAccount() {
    return this.service.getDefaultAccount();
  }
}
