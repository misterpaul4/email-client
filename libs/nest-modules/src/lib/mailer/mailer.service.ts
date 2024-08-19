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
import { SendMailDto, SmptParentKey } from '@interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailerService implements OnModuleInit {
  private logger = new Logger(MailerService.name);

  private transporter?: Transporter<SendMailOptions>;
  private defaultAccount?: Partial<Account>;

  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(Provider) private providerRepo: Repository<Provider>
  ) {}

  async onModuleInit() {
    const data = await this.accountRepo.find({
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
      relations: ['provider'],
    });

    if (data.length) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].provider) {
          this.defaultAccount = data[index];
          const isValid = this.validateTransport(data[index].provider);

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
    this.transporter = this.createTransport(provider);
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
      transporter = this.createTransport(resp.provider);
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

  validateTransport(provider: Provider): boolean {
    const transport = provider.smtp;
    const transporter = this.createTransport(provider);
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

  private createTransport(provider: Provider) {
    const smtp = { ...provider.smtp };
    const dataKey = SmptParentKey[provider.connectionType];
    const extract: Record<string, any> = {};

    if (dataKey) {
      extract[dataKey] = { ...smtp.data, user: this.defaultAccount?.email };
    }

    delete smtp.data;

    const payload = {
      ...smtp,
      ...extract,
      secure: smtp.port == 465,
    };

    return ct(payload);
  }
}
