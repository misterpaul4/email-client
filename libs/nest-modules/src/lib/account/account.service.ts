import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Provider } from '@entities';
import { ProviderService } from '../provider';
import { MailerService } from '../mailer';
import { ProviderDefaults } from '@enums';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repo: Repository<Account>,
    private providerService: ProviderService,
    private mailerService: MailerService
  ) {}

  async createAccount(dto: Account) {
    if (!Object.keys(dto.provider || {}).length && !dto.providerId) {
      throw new BadRequestException('Missing provider configuration');
    }

    dto.provider = await this.providerValidations(dto.provider, dto.email);

    return this.repo.save(dto);
  }

  getMany() {
    return this.repo.find();
  }

  private async providerValidations(
    provider: Provider,
    email: string
  ): Promise<Provider> {
    if (!provider) {
      provider;
    }

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

    // validate transport
    const { isValid, message } = await this.mailerService.validateTransport(
      provider,
      email
    );

    if (!isValid) {
      throw new BadRequestException(message);
    }

    return result;
  }

  async deleteAccount(id: string) {
    return this.repo.delete({ id });
  }
}
