import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {User} from '@entities'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>
  ) {
  }

  getMany() {
    return this.repo.find()
  }
}
