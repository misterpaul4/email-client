import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Provider} from '@entities'

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider) private repo: Repository<Provider>
  ) {
  }
}
