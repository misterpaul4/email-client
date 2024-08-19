import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common";
import {ConnectionType, ProviderEnum, ProviderStatus} from '@enums'
import {SmtpConfig} from '@interfaces'

@Entity()
export class Provider extends BaseEntity {
  @Column({type: 'text'})
  name: ProviderEnum;

  @Column({type: 'text'})
  status: ProviderStatus

  @Column({type: 'text'})
  conectionType: ConnectionType

  @Column({type: 'jsonb'})
  smtp: SmtpConfig
}
