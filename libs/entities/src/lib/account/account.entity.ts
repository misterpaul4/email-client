import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common';
import { Provider } from '../provider';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Account extends BaseEntity {
  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @IsEmail()
  @Column({ type: 'text', unique: true })
  email: string;

  @IsUUID('4')
  @IsOptional()
  @Column({ type: 'uuid', nullable: true })
  providerId?: string;

  @Type(() => Provider)
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @ManyToOne(() => Provider, (provider) => provider.accounts, { cascade: true })
  provider: Provider;
}
