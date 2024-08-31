import { Injectable, Logger } from '@nestjs/common';
import {
  GOOGLE_REDIRECT_URI,
  GOOGLE_TOKEN_URI,
  GOOGLE_USER_INFO_URI,
} from '@constants';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { GatewayService } from '../gateway';
import { ProviderCallbackParams, ProviderEnum, WebSocketEvents } from '@enums';
import {
  GoogleOauthTokenResponse,
  GoogleUserInfoResponse,
  ProviderCallbackReponseData,
} from '@interfaces';
import axios from 'axios';

@Injectable()
export class OauthCallbackService {
  private logger = new Logger(OauthCallbackService.name);

  private googleClientId?: string;
  private googleClientSecret?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly gatewayService: GatewayService
  ) {
    this.googleClientId = this.configService.get('VITE_GOOGLE_CLIENT_ID');
    this.googleClientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
  }

  async handleGoogleCallback(
    code: string,
    clientId: string
  ): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    // exchange code for tokens
    if (!this.googleClientId || !this.googleClientSecret) {
      // TODO: redirect to failed url with param as reason for failure
      return {
        isSuccess: false,
        message: 'Missing parameters',
      };
    }

    const params = new URLSearchParams();

    params.append('client_id', this.googleClientId);
    params.append('client_secret', this.googleClientSecret);
    params.append('code', code);
    params.append('redirect_uri', GOOGLE_REDIRECT_URI);
    params.append('grant_type', 'authorization_code');

    const tokenReqResponse: GoogleOauthTokenResponse = await this.httpService
      .post(GOOGLE_TOKEN_URI, params)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          this.logger.error(error.message);
          // TODO: redirect to failed url
          throw new Error(`Action cannot be completed: ${error.message}`);
        })
      )
      .toPromise();

    if (!tokenReqResponse.access_token) {
      // TODO: redirect to failed url
      return {
        message: 'Code exchange request unsuccessful:',
        isSuccess: false,
      };
    }

    // get user details
    let userInfo: GoogleUserInfoResponse;

    try {
      const { data } = await axios.get<GoogleUserInfoResponse>(
        GOOGLE_USER_INFO_URI,
        {
          headers: {
            Authorization: `Bearer ${tokenReqResponse.access_token}`,
          },
        }
      );

      userInfo = data;
    } catch (error) {
      const message = 'Unable to fetch user info';

      this.logger.error({
        message,
        error,
      });

      return {
        isSuccess: false,
        message,
      };
    }

    const callbackPayload: ProviderCallbackReponseData = {
      payload: {
        accessToken: tokenReqResponse.access_token,
        refreshToken: tokenReqResponse.refresh_token,
        expires: tokenReqResponse.expires_in,
        scope: tokenReqResponse.scope,
        clientId: this.googleClientId,
        clientSecret: this.googleClientSecret,
      },
      provider: ProviderEnum.google,
      userInfo,
    };

    const isDelivered = await this.gatewayService.emitAndWait({
      clientId,
      payload: callbackPayload,
      event: WebSocketEvents.OauthCred,
    });

    if (!isDelivered) {
      return {
        message: 'Error communicating with client server',
        isSuccess: false,
      };
    }

    return {
      isSuccess: true,
      message: ProviderCallbackParams.SUCCESS,
    };
  }
}
