import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Account} from '@entities'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repo: Repository<Account>
  ) {
  }

  getMany() {
    return this.repo.find()
  }
}
