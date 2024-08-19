import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from '@interfaces';

@Controller('mailer')
export class MailerController {
  constructor(private service: MailerService) {}

  @Post('send-mail')
  sendMail(@Body() dto: SendMailDto) {
    return this.service.sendEmail(dto);
  }
}
