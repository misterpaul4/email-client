import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  SendMailOptions,
  Transporter,
  createTransport as ct,
} from 'nodemailer';
import { Account, Provider } from '@entities';
import { SmtpConfigDto } from '@interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailerService implements OnModuleInit {
  private logger = new Logger(MailerService.name);

  private transporter?: Transporter<SendMailOptions>;
  private defaultAccount?: Partial<Account>;

  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(Provider) private providerRepo: Repository<Provider>,
  ) {}

  async onModuleInit() {
    const data = await this.accountRepo.find({
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
      relations: ['provider'],
    });

    if (data.length) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].provider) {
          const isValid = this.validateTransport(data[index].provider.smtp);

          if (isValid) {
            this.setDefaults(data[index]);
            break;
          }
        }
      }
    }
  }

  async setDefaults(account: Account) {
    let provider = account.provider;

    if (!provider) {
      const resp = await this.providerRepo.findOne({
        where: { id: account.providerId },
      });

      if (!resp) {
        throw new BadRequestException('Missing provider configuration');
      }

      provider = resp;
    }

    this.defaultAccount = account;
    this.transporter = this.createTransport(provider.smtp);
  }

  async sendEmail(accountId: string, payload: SendMailOptions) {
    let transporter = this.transporter;

    if (accountId !== this.defaultAccount?.id) {
      const account = await this.accountRepo.findOne({
        where: { id: accountId },
        relations: ['provider'],
      });

      if (!account?.provider) {
        throw new BadRequestException('Missing provider configuration');
      }

      transporter = this.createTransport(account.provider.smtp);
    }

    if (!transporter) {
      throw new BadRequestException('Action cannot be completed!');
    }

    const info = await transporter.sendMail(payload);

    this.logger.log('Message sent: %s', info.messageId);
  }

  validateTransport(transport: SmtpConfigDto): boolean {
    const transporter = this.createTransport(transport);
    transporter.verify((error: any) => {
      if (error) {
        this.logger.error({
          message: 'Provider configurations is not valid',
          error,
          transport,
        });

        return false;
      }

      this.logger.log({
        message: 'Server is ready to take messages',
        transport,
      });

      return true;
    });

    return true;
  }

  private createTransport(smtp: SmtpConfigDto) {
    return ct({
      ...smtp,
      secure: smtp.port == 465,
    });
  }
}
