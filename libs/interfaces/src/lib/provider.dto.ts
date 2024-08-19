import {ConnectionType, ProviderEnum, ProviderStatus} from '@enums'
import {IsEnum, ValidateNested} from 'class-validator'
import { Type } from 'class-transformer'

export class SharedConfigDto {
  host: string
  port: number
}

export class SmtpConfigDto extends SharedConfigDto {}


export class CreateProviderDto {
  @IsEnum(ProviderEnum)
  name: ProviderEnum

  @IsEnum(ProviderStatus)
  status: ProviderStatus

  @IsEnum(ConnectionType)
  conectionType: ConnectionType

  @Type(() => SmtpConfigDto)
  @ValidateNested()
  smtp: SmtpConfigDto
}

