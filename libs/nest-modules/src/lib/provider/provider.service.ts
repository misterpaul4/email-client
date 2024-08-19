import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Provider } from '@entities';

@Injectable()
export class ProviderService {
  constructor(@InjectRepository(Provider) private repo: Repository<Provider>) {}

  getMany(payload?: {
    where?: FindOneOptions<Provider>['where'];
    order?: FindOneOptions<Provider>['order'];
  }) {
    return this.repo.find(payload);
  }

  getOne(where?: FindOneOptions<Provider>['where']) {
    return this.repo.findOne({
      where,
    });
  }
}
