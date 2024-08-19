import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common';
import { Provider } from '../provider';
import {
  IsBoolean,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProviderDto } from '@interfaces';
import { PartialType } from '@nestjs/mapped-types';

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

  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Type(() => CreateProviderDto)
  @IsObject()
  @IsOptional()
  @ManyToOne(() => Provider, { cascade: true })
  provider: Provider;
}
