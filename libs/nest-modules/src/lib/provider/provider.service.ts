import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Provider } from '@entities';
import { MicrosoftOauthTokenResponse, SmptValidationGroup } from '@interfaces';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { MICROSOFT_TOKEN_URI, MICROSOFT_USER_INFO_URI } from '@constants';
import { AppErrorEnum, ProviderEnum } from '@enums';

@Injectable()
export class ProviderService {
  private logger = new Logger(ProviderService.name);

  private microsoftClientId?: string;
  private microsoftClientSecret?: string;

  constructor(
    @InjectRepository(Provider) public repo: Repository<Provider>,
    private readonly configService: ConfigService
  ) {
    this.microsoftClientId = this.configService.get('VITE_MICROSOFT_CLIENT_ID');
    this.microsoftClientSecret = this.configService.get(
      'MICROSOFT_CLIENT_SECRET'
    );
  }

  getMany(payload?: {
    where?: FindOneOptions<Provider>['where'];
    order?: FindOneOptions<Provider>['order'];
  }) {
    return this.repo.find(payload);
  }

  getOne(where?: FindOneOptions<Provider>['where']) {
    return this.repo.findOne({
      where,
    });
  }

  validateSmtpPayload(dto: Provider) {
    if (!dto.smtp.data) {
      throw new BadRequestException('Missing smtp data');
    }
    const validatorClass = SmptValidationGroup[dto.name][dto.connectionType];

    const cpt = plainToInstance(validatorClass, dto.smtp.data);
    const errors = validateSync(cpt as any);

    if (errors.length > 0) {
      throw new BadRequestException({
        errors: errors
          .map((error) => Object.values(error.constraints || {}))
          .flat()
          .join(', '),
        messsage: 'Missing smtp data',
      });
    }
  }

  isAccessTokenExpired(expiresIn?: number): boolean {
    return expiresIn ? Date.now() > expiresIn : false;
  }

  refreshProviderToken(
    provider: ProviderEnum,
    refreshToken: string
  ): Promise<MicrosoftOauthTokenResponse> | undefined {
    switch (provider) {
      case ProviderEnum.outlook:
        return this.refreshMicrosoftAccessToken(refreshToken);

      default:
        return;
    }
  }

  validateProviderToken(
    provider: ProviderEnum,
    accessToken: string
  ): Promise<boolean> {
    switch (provider) {
      case ProviderEnum.outlook:
        return this.validateMicrosoftCredentials(accessToken);

      default:
        return Promise.resolve(false);
    }
  }

  private async validateMicrosoftCredentials(
    accessToken: string
  ): Promise<boolean> {
    try {
      const { data } = await axios.get(MICROSOFT_USER_INFO_URI, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      return !!data;
    } catch (error) {
      const message = 'Unable to fetch user info';

      this.logger.error({
        message,
        error,
      });

      return false;
    }
  }

  async refreshMicrosoftAccessToken(
    refreshToken: string
  ): Promise<MicrosoftOauthTokenResponse> {
    if (!this.microsoftClientId || !this.microsoftClientSecret) {
      throw new BadRequestException('Missing microsoft credentials');
    }

    const body = new URLSearchParams({
      client_id: this.microsoftClientId,
      client_secret: this.microsoftClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    try {
      const resp = await axios.post(MICROSOFT_TOKEN_URI, body.toString());

      return resp.data;
    } catch (error: any) {
      const message = 'Failed to refresh microsoft access token';

      if (error?.response?.data?.error === 'invalid_grant') {
        throw new BadRequestException({
          message,
          error: AppErrorEnum.TOKEN_EXPIRED,
        });
      }

      throw new BadRequestException(message);
    }
  }
}
