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
import { SendMailDto } from '@interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionType } from '@enums';
import SMTPConnection = require('nodemailer/lib/smtp-connection');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService implements OnModuleInit {
  private logger = new Logger(MailerService.name);

  private transporter?: Transporter<SendMailOptions>;
  private defaultAccount?: Partial<Account>;
  private shouldSetDefaultAccountOnMount = false;

  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(Provider) private providerRepo: Repository<Provider>,
    private configService: ConfigService
  ) {
    this.shouldSetDefaultAccountOnMount =
      this.configService.get('SET_DEFAULT_ACCOUNT_ON_MOUNT') === 'true';
  }

  async onModuleInit() {
    if (this.shouldSetDefaultAccountOnMount) {
      this.initialize();
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
    this.transporter = this.createTransport(provider, account.email);
  }

  async resetDefault(accountId?: string) {
    if (accountId === this.defaultAccount?.id) {
      const defaultAccountIsSet = await this.initialize();

      if (!defaultAccountIsSet) {
        this.defaultAccount = undefined;
        this.transporter = undefined;
      }
    }
  }

  async sendEmail(dto: SendMailDto) {
    let transporter = this.transporter;
    let account = this.defaultAccount;
    const { accountId } = dto;

    if (accountId !== this.defaultAccount?.id) {
      const resp = await this.accountRepo.findOne({
        where: { id: accountId },
        relations: ['provider'],
      });

      if (!resp?.provider) {
        throw new BadRequestException('Missing provider configuration');
      }

      account = resp;
      transporter = this.createTransport(resp.provider, account.email);
    }

    if (!transporter) {
      throw new BadRequestException('Action cannot be completed!');
    }

    const payload: SendMailOptions = {
      from: account?.email,
      ...dto,
    };

    const info = await transporter.sendMail(payload);

    this.logger.log('Message sent: %s', info.messageId);
  }

  async validateTransport(
    provider: Provider,
    email?: string
  ): Promise<{
    message?: string;
    isValid: boolean;
  }> {
    const transport = provider.smtp;
    const transporter = this.createTransport(provider, email);

    try {
      await transporter.verify();

      this.logger.log({
        message: 'Server is ready to take messages',
        transport,
      });
    } catch (error: any) {
      const message = `Configurations is not valid for provider${
        provider.id ? ' with ID: ' + provider.id : ''
      }: ${error.response}`;

      this.logger.error({
        message,
        error,
        transport,
      });

      return {
        message,
        isValid: false,
      };
    }

    return {
      isValid: true,
    };
  }

  private createTransport(provider: Provider, email?: string) {
    const { smtp } = provider;

    const payload: SMTPConnection['options'] = {
      ...smtp,
      auth: {
        ...smtp.data,
        user: (email || this.defaultAccount?.email) as string,
        pass: smtp.data?.['pass'] as string,
        type:
          provider.connectionType === ConnectionType.oAuth ? 'oauth2' : 'login',
      },
    };

    return ct(payload);
  }

  private async initialize() {
    let defaultAccountIsSet = false;

    const data = await this.accountRepo.find({
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
      relations: ['provider'],
      take: 3,
    });

    if (data.length) {
      for (let index = 0; index < data.length; index++) {
        const account = data[index];

        if (account.provider) {
          this.defaultAccount = account;
          const { isValid, message } = await this.validateTransport(
            account.provider
          );

          if (isValid) {
            this.setDefaults(account);
            defaultAccountIsSet = true;
            break;
          }

          this.logger.warn({
            message,
            accountId: account.id,
            providerId: account.providerId,
            provider: account.provider.name,
          });
        }
      }
    }

    if (!this.transporter) {
      this.logger.warn('No default account found');
    }

    return defaultAccountIsSet;
  }
}
