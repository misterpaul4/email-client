import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Account } from '@entities';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private repo: Repository<Account>) {}

  createAccount(dto: Account) {
    if (!Object.keys(dto.provider || {}).length && !dto.providerId) {
      throw new BadRequestException('Missing provider configuration');
    }

    return dto;
  }

  getMany() {
    return this.repo.find();
  }
}
