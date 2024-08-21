import { ConnectionType, ProviderEnum } from '@enums';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SharedConfigDto {
  @IsString()
  host: string;

  @IsNumber()
  port: number;
}

class AppPasswordDto {
  @IsString()
  pass: string;
}

export const SmptValidationGroup: Record<
  ProviderEnum,
  Record<ConnectionType, any>
> = {
  [ProviderEnum.google]: {
    [ConnectionType.appPassword]: AppPasswordDto,
    [ConnectionType.oAuth]: {},
  },
  [ProviderEnum.outlook]: {
    [ConnectionType.appPassword]: AppPasswordDto,
    [ConnectionType.oAuth]: {},
  },
};

export class SmtpConfigDto extends SharedConfigDto {
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}

export class CreateProviderDto {
  @IsEnum(ProviderEnum)
  name: ProviderEnum;

  @IsEnum(ConnectionType)
  connectionType: ConnectionType;

  @Type(() => SmtpConfigDto)
  @ValidateNested()
  @IsObject()
  smtp: SmtpConfigDto;
}
