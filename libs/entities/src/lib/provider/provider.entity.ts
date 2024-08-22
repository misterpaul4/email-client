import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../common';
import { ConnectionType, ProviderEnum, ProviderStatus } from '@enums';
import { SmtpConfigDto } from '@interfaces';
import { Account } from '../account';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Provider extends BaseEntity {
  @Index()
  @IsEnum(ProviderEnum)
  @Column({ type: 'text' })
  name: ProviderEnum;

  @Column({ type: 'text', default: ProviderStatus.active })
  status: ProviderStatus;

  @Column({ type: 'text' })
  @IsEnum(ConnectionType)
  connectionType: ConnectionType;

  @Type(() => SmtpConfigDto)
  @ValidateNested()
  @IsObject()
  @Column({ type: 'jsonb' })
  smtp: SmtpConfigDto;

  @OneToMany(() => Account, (account) => account.provider)
  accounts?: Account[];
}
