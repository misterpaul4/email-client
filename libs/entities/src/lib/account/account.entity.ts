import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common';
import { Provider } from '../provider';
import {
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProviderDto } from '@interfaces';

@Entity()
export class Account extends BaseEntity {
  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @IsEmail()
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'boolean', default: false })
  alias: boolean;

  @IsUUID('4')
  @IsOptional()
  @Column({ type: 'uuid', nullable: true })
  providerId?: string;

  @Type(() => CreateProviderDto)
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @ManyToOne(() => Provider, (provider) => provider.accounts, { cascade: true })
  provider: Provider;
}
