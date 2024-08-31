import { ConnectionType, ProviderEnum } from '@enums';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class SharedConfigDto {
  @IsString()
  @IsOptional()
  host?: string;

  @IsOptional()
  @IsNumber()
  port?: number;
}

class AppPasswordDto {
  @IsString()
  pass: string;
}

class Oauth2Dto {
  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  refreshToken: string;

  @IsString()
  accessToken: string;

  @IsNumber()
  @IsOptional()
  expires?: number;

  @IsString()
  @IsOptional()
  accessUrl?: string;

  @IsString()
  @IsOptional()
  scope?: string;
}

export const SmptValidationGroup: Record<
  ProviderEnum,
  Record<ConnectionType, any>
> = {
  [ProviderEnum.google]: {
    [ConnectionType.appPassword]: AppPasswordDto,
    [ConnectionType.oAuth]: Oauth2Dto,
  },
  [ProviderEnum.outlook]: {
    [ConnectionType.appPassword]: AppPasswordDto,
    [ConnectionType.oAuth]: {},
  },
  [ProviderEnum.zoho]: {
    [ConnectionType.appPassword]: AppPasswordDto,
    [ConnectionType.oAuth]: {},
  },
};

export class SmtpConfigDto extends SharedConfigDto {
  @IsObject()
  @IsOptional()
  data?: AppPasswordDto | Oauth2Dto;
}

export interface GoogleOauthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface GoogleUserInfoResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface ProviderCallbackReponseData {
  payload: Oauth2Dto;
  userInfo?: GoogleUserInfoResponse;
  provider: ProviderEnum;
}
