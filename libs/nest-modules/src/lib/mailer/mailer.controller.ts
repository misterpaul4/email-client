import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from '@interfaces';
import { Provider } from '@entities';

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

  @Post('validate-smtp/:email')
  validateSmtp(@Body() dto: Provider, @Param('email') email: string) {
    return this.service.validateTransport(dto, email);
  }
}
