import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common';
import { Provider } from '../provider';

@Entity()
export class Account extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'boolean', default: false })
  alias: boolean;

  @Column({ type: 'uuid', nullable: true })
  providerId?: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean

  @ManyToOne(() => Provider, { cascade: true })
  provider: Provider;
}
