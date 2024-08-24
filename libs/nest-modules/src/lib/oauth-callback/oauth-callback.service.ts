import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthCallbackService {
  handleGoogleCallback(code: string) {
    // exchange code for tokens
    // send to client
  }
}
