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
import {
  AppPasswordDto,
  Oauth2Dto,
  SendMailDto,
  SmtpConfigDto,
} from '@interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionType, ProviderEnum, ProviderStatus } from '@enums';
import SMTPConnection = require('nodemailer/lib/smtp-connection');
import { ConfigService } from '@nestjs/config';
import { STATUS_CODES } from 'http';
import { ProviderService } from '../provider';
import { getTokenExpirationTime, MICROSOFT_SEND_MAIL_URI } from '@constants';
import axios from 'axios';

@Injectable()
export class MailerService implements OnModuleInit {
  private logger = new Logger(MailerService.name);

  private transporter?: Transporter<SendMailOptions>;
  private defaultAccount?: Account;
  private shouldSetDefaultAccountOnMount = false;
  private apiOnlyOauthProviders: ProviderEnum[] = [ProviderEnum.outlook];

  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    private providerService: ProviderService,
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
      const resp = await this.providerService.repo.findOne({
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

  private async sendMicrosoftOauthMail(
    payload: {
      message: {
        subject?: string;
        body: {
          contentType: 'HTML' | 'Text';
          content: string;
        };
        toRecipients: {
          emailAddress: {
            address: string;
          };
        }[];
      };
    },
    account: Account
  ): Promise<string | void> {
    this.logger.log(`Sending microsoft mail`);

    try {
      const validationResp = await this.validateTransport(
        account.provider,
        account.email
      );

      if (validationResp.isValid) {
        const data = validationResp.data as Oauth2Dto;
        const resp = await axios.post(MICROSOFT_SEND_MAIL_URI, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        return resp.data || account.id;
      }
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async sendApiMail(dto: SendMailDto, account: Account) {
    // validate access token expirations
    switch (account.provider.name) {
      case ProviderEnum.outlook:
        return this.sendMicrosoftOauthMail(
          {
            message: {
              subject: dto.subject,
              body: {
                contentType: 'HTML',
                content: dto.text,
              },
              toRecipients: [
                {
                  emailAddress: {
                    address: dto.to,
                  },
                },
              ],
            },
          },
          account
        );
      //
      default:
        break;
    }

    return undefined;
  }

  async sendTransportMail(dto: SendMailDto, account: Account) {
    const transporter = this.createTransport(account.provider, account.email);

    const payload: SendMailOptions = {
      from: account.email,
      ...dto,
    };

    const info = await transporter.sendMail(payload);

    return info.messageId;
  }

  async sendEmail(dto: SendMailDto) {
    // get account
    const account = await this.accountRepo.findOne({
      where: { id: dto.accountId },
      relations: ['provider'],
    });

    if (!account?.provider) {
      throw new BadRequestException('Missing provider configuration');
    }

    const messageId: string | void = await (this.isUsingProviderApiForMail(
      account.provider
    )
      ? this.sendApiMail(dto, account)
      : this.sendTransportMail(dto, account));

    if (!messageId) {
      throw new BadRequestException('Action cannot be completed!');
    }

    this.logger.log(`Message sent: ${messageId}`);

    return messageId;
  }

  async validateTransport(
    provider: Provider,
    email: string
  ): Promise<{
    message?: string;
    isValid: boolean;
    data: SmtpConfigDto['data'];
  }> {
    const transport = provider.smtp;
    const transporter = this.createTransport(provider, email);

    const isSuccess = () => {
      if (provider.id) {
        this.logger.log('Validate transport success');
      } else {
        this.logger.log({
          message: 'Server is ready to take messages',
          transport,
          email,
        });
      }
    };

    try {
      if (this.isUsingProviderApiForMail(provider)) {
        const resp = await this.validateApiTransport(provider, true);
        if (resp.isValid) {
          isSuccess();
        }
        return resp;
      }

      await transporter.verify();

      isSuccess();
    } catch (error: any) {
      const existingProvider = provider.id;

      const message = 'Configurations is not valid for provider'
        .concat(existingProvider ? ` with ID: ${provider.id}` : '')
        .concat(error.response ? `: ${error.response}` : '');

      this.logger.error({
        message,
        error,
        transport,
        email,
      });

      // set provider inactive
      if (existingProvider && provider.status === ProviderStatus.active) {
        this.providerService.repo
          .update({ id: existingProvider }, { status: ProviderStatus.inactive })
          .catch((error) => {
            this.logger.error({
              message: 'Failed to update provider status',
              error,
              transport,
              email,
            });
          });
      }

      return {
        message,
        isValid: false,
        data: transport.data,
      };
    }

    return {
      isValid: true,
      data: transport.data,
    };
  }

  async validateApiTransport(
    provider: Provider,
    shouldUpdate = false,
    shouldSkipValidation = false
  ): Promise<{ isValid: boolean; message?: string; data: Oauth2Dto }> {
    const data = provider.smtp.data as Oauth2Dto;
    let newAccessToken = false;
    let isValid = false;

    if (!data.accessToken) {
      return { isValid: false, message: 'Missing access token', data };
    }

    if (this.providerService.isAccessTokenExpired(data.expiresIn)) {
      const refreshTokenResponse =
        await this.providerService.refreshProviderToken(
          provider.name,
          data.refreshToken
        );

      if (refreshTokenResponse) {
        this.logger.log(
          `Refreshed access token for provider [${provider.name}]: ${provider.id}`
        );
        data.accessToken = refreshTokenResponse.access_token;
        data.expires = refreshTokenResponse.expires_in;
        data.expiresIn = getTokenExpirationTime(
          refreshTokenResponse.expires_in
        );
        data.refreshToken = refreshTokenResponse.refresh_token;
        newAccessToken = true;
        isValid = true;
      }
    } else {
      isValid = true;
    }

    if (!shouldSkipValidation) {
      // validate via provider api
      isValid = await this.providerService.validateProviderToken(
        provider.name,
        data.accessToken
      );
    }

    if (
      provider.id &&
      (isValid || shouldSkipValidation) &&
      shouldUpdate &&
      newAccessToken
    ) {
      this.providerService.repo
        .update(provider.id, {
          smtp: {
            ...provider.smtp,
            data: {
              ...provider.smtp.data,
              ...data,
            },
          },
        })
        .catch((error) => {
          this.logger.error({
            message: 'Failed to update provider token data',
            error,
            provider,
          });
        });
    }

    return {
      isValid,
      data,
    };
  }

  private createTransport(provider: Provider, email?: string) {
    const { smtp } = provider;

    const payload: SMTPConnection['options'] = {
      ...smtp,
      auth: {
        ...smtp.data,
        user: email || this.defaultAccount?.email || '',
        pass: (smtp.data as AppPasswordDto)?.['pass'],
        type:
          provider.connectionType === ConnectionType.oAuth ? 'oauth2' : 'login',
      },
    };

    return ct(payload);
  }

  private isUsingProviderApiForMail(provider: Provider) {
    return (
      provider.connectionType === ConnectionType.oAuth &&
      this.apiOnlyOauthProviders.includes(provider.name)
    );
  }

  private async initialize() {
    let defaultAccountIsSet = false;

    const data = await this.accountRepo
      .createQueryBuilder('account')
      .orderBy('provider.status', 'ASC')
      .addOrderBy('account.createdAt', 'ASC')
      .innerJoinAndSelect('account.provider', 'provider')
      .take(5)
      .getMany();

    if (data.length) {
      for (let index = 0; index < data.length; index++) {
        const account = data[index];

        if (account.provider) {
          const { isValid, message } = await this.validateTransport(
            account.provider,
            account.email
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

  getDefaultAccount(): {
    status: number;
    statusText?: string;
    message?: string;
    data?: Partial<Account>;
  } {
    if (!this.defaultAccount) {
      return {
        message: 'No default account found',
        statusText: STATUS_CODES[404],
        status: 404,
      };
    }

    return {
      status: 200,
      data: {
        email: this.defaultAccount.email,
      },
    };
  }
}
