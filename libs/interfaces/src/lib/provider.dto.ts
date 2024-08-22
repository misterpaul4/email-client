import { ConnectionType, ProviderEnum } from '@enums';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

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
