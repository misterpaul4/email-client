import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '@entities';
import { ProviderService } from '../provider';
import { CreateProviderDto } from '@interfaces';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repo: Repository<Account>,
    private providerService: ProviderService
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
    }

    return this.repo.save(dto);
  }

  getMany() {
    return this.repo.find();
  }
}
