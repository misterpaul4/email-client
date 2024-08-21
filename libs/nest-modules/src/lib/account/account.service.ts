import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '@entities';
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

    if (dto.provider) {
      // validate smtp payload
      this.providerService.validateSmtpPayload(
        dto.provider as unknown as CreateProviderDto
      );

      // validate transport
      const isValidTransport = await this.mailerService.validateTransport(dto.provider, dto.email);

      if (!isValidTransport) {
        throw new BadRequestException('Provider configuration is not valid');
      }
    }

    return this.repo.save(dto);
  }

  getMany() {
    return this.repo.find();
  }
}
