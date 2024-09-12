import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Provider } from '@entities';
import { ProviderService } from '../provider';
import { MailerSmtpService } from '../mailer';
import { ProviderDefaults } from '@enums';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repo: Repository<Account>,
    private providerService: ProviderService,
    private mailerService: MailerSmtpService
  ) {}

  async createAccount(dto: Account, shouldSkipTransportValidation = false) {
    if (!Object.keys(dto.provider || {}).length && !dto.providerId) {
      throw new BadRequestException('Missing provider configuration');
    }

    dto.provider = await this.providerValidations(
      dto.provider,
      dto.email,
      shouldSkipTransportValidation
    );

    return this.repo.save(dto);
  }

  async updateAccount(dto: Account, account: Account) {
    await this.repo.update(account.id!, {
      picture: dto.picture || account.picture,
      fullName: dto.fullName || account.fullName,
    });

    if (account.providerId) {
      dto.provider = await this.providerValidations(dto.provider, dto.email);

      await this.providerService.repo.update(account.providerId, {
        smtp: {
          ...account.provider?.smtp,
          data: {
            ...account.provider?.smtp?.data,
            ...dto.provider?.smtp?.data,
          },
        },
      });
    }

    return account;
  }

  async createOrUpdateAccount(
    dto: Account,
    shouldSkipTransportValidation = false
  ) {
    // check if email exist
    const account = await this.repo.findOne({
      where: { email: dto.email },
      relations: ['provider'],
    });

    if (account?.id) {
      return this.updateAccount(dto, account);
    }

    return this.createAccount(dto, shouldSkipTransportValidation);
  }

  getMany() {
    return this.repo.find();
  }

  private async providerValidations(
    provider: Provider,
    email: string,
    shouldSkipTransportValidation = false
  ): Promise<Provider> {
    // validate smtp payload
    this.providerService.validateSmtpPayload(provider);

    const { smtp, name: providerName } = provider;

    const result = { ...provider };

    if (smtp) {
      const { host: defaultHost, port: defaultPort } =
        ProviderDefaults[providerName];

      if (!smtp.host) {
        result.smtp.host = defaultHost;
      }

      if (!smtp.port) {
        result.smtp.port = defaultPort;
      }
    }

    if (!shouldSkipTransportValidation) {
      // validate transport
      const { isValid, message } = await this.mailerService.validateTransport(
        provider,
        email
      );

      if (!isValid) {
        throw new BadRequestException(message);
      }
    }

    return result;
  }

  async deleteAccount(id: string) {
    return this.repo.delete({ id });
  }
}
