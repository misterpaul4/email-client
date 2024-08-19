import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../common';
import { ConnectionType, ProviderEnum, ProviderStatus } from '@enums';
import { SmtpConfigDto } from '@interfaces';
import { Account } from '../account';

@Entity()
export class Provider extends BaseEntity {
  @Index()
  @Column({ type: 'text' })
  name: ProviderEnum;

  @Column({ type: 'text', default: ProviderStatus.active })
  status: ProviderStatus;

  @Column({ type: 'text' })
  connectionType: ConnectionType;

  @Column({ type: 'jsonb' })
  smtp: SmtpConfigDto;

  @OneToMany(() => Account, (account) => account.provider)
  accounts?: Account[];
}
