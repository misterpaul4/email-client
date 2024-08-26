import { Injectable, Logger } from '@nestjs/common';
import { GOOGLE_REDIRECT_URI, GOOGLE_TOKEN_URI } from '@constants';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class OauthCallbackService {
  private logger = new Logger(OauthCallbackService.name);

  private googleClientId?: string;
  private googleClientSecret?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.googleClientId = this.configService.get('VITE_GOOGLE_CLIENT_ID');
    this.googleClientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
  }

  async handleGoogleCallback(code: string, clientId: string) {
    // exchange code for tokens
    if (!this.googleClientId || !this.googleClientSecret) {
      return {
        message: 'Action cannot be completed',
        error: 'Missing parameters',
      };
    }

    const params = new URLSearchParams();

    params.append('client_id', this.googleClientId);
    params.append('client_secret', this.googleClientSecret);
    params.append('code', code);
    params.append('redirect_uri', GOOGLE_REDIRECT_URI);
    params.append('grant_type', 'authorization_code');

    const tokenReqResponse = await this.httpService
      .post(GOOGLE_TOKEN_URI, params)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          this.logger.error(error.message);
          throw new Error(`Action cannot be completed: ${error.message}`);
        })
      ).toPromise();

    // TODO: emit message to source client
    return tokenReqResponse
  }
}
