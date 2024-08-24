import { Controller, Get, Query } from '@nestjs/common';
import { OauthCallbackService } from './oauth-callback.service';

@Controller('oauth')
export class OauthCallbackController {
  constructor(private service: OauthCallbackService) {}

  @Get('google')
  googleCallbackHandler(
    @Query('code') code: string,
  ) {
    return this.service.handleGoogleCallback(code);
  }
}
