import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Account } from '@entities';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) public repo: Repository<Account>) {}

  getMany() {
    return this.repo.find();
  }
}
