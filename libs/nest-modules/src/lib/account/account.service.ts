import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Provider } from '@entities';
import { ProviderService } from '../provider';
import { CreateProviderDto } from '@interfaces';
import { MailerService } from '../mailer';

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

    await this.providerValidations(dto.provider, dto.email);

    return this.repo.save(dto);
  }

  getMany() {
    return this.repo.find();
  }

  private async providerValidations(provider: Provider, email: string) {
    if (!provider) {
      return;
    }

    // validate smtp payload
    this.providerService.validateSmtpPayload(
      provider as unknown as CreateProviderDto
    );

    // validate transport
    const { isValid, message } = await this.mailerService.validateTransport(
      provider,
      email
    );

    if (!isValid) {
      throw new BadRequestException(message);
    }
  }
}
