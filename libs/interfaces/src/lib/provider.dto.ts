import {ConnectionType, ProviderEnum, ProviderStatus} from '@enums'
import {IsEnum, ValidateNested} from 'class-validator'
import { SmtpConfig } from './provider.interface'
import { Type } from 'class-transformer'


export class CreateProviderDto {
  @IsEnum(ProviderEnum)
  name: ProviderEnum

  @IsEnum(ProviderStatus)
  status: ProviderStatus

  @IsEnum(ConnectionType)
  conectionType: ConnectionType

  @Type(() => SmtpConfig)
  @ValidateNested()
  smtp: SmtpConfig
}
