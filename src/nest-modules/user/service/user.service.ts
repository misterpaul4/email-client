import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "entities";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) public repo: Repository<User>) {
  }

  getMany() {
    return this.repo.find()
  }

  createOne(dto: User) {
    const instance = this.repo.create(dto)
    return this.repo.save(instance)
  }
}
