import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Provider } from '@entities';
import { SmptValidationGroup } from '@interfaces';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

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

  validateSmtpPayload(dto: Provider) {
    if (!dto.smtp.data) {
      throw new BadRequestException('Missing smtp data');
    }
    const validatorClass = SmptValidationGroup[dto.name][dto.connectionType];

    const cpt = plainToInstance(validatorClass, dto.smtp.data);
    const errors = validateSync(cpt as any);

    if (errors.length > 0) {
      throw new BadRequestException({
        errors: errors
          .map((error) => Object.values(error.constraints || {}))
          .flat()
          .join(', '),
        messsage: 'Missing smtp data',
      });
    }
  }
}
