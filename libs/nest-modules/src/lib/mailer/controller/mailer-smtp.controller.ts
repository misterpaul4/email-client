import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SendMailDto } from '@interfaces';
import { Provider } from '@entities';
import { MailerSmtpService } from '../service';

@Controller('mailer')
export class MailerController {
  constructor(private service: MailerSmtpService) {}

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
