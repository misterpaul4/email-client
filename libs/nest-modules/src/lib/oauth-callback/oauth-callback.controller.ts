import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { OauthCallbackService } from './oauth-callback.service';
import { Response } from 'express';

@Controller('oauth')
export class OauthCallbackController {
  constructor(private service: OauthCallbackService) {}

  @Get('google')
  async googleCallbackHandler(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    let clientId: string;
    let returnUrl: string;

    try {
      const stateObj = JSON.parse(state);
      clientId = stateObj.clientId;
      returnUrl = stateObj.returnUrl;
    } catch (error) {
      throw new BadRequestException('Invalid state');
    }

    const response = await this.service.handleGoogleCallback(code, clientId);


    res.redirect(`${returnUrl}?${response.message}`);
  }

  @Get('microsoft')
  async microsoftCallbackHandler(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    let clientId: string;
    let returnUrl: string;

    try {
      const stateObj = JSON.parse(state);
      clientId = stateObj.clientId;
      returnUrl = stateObj.returnUrl;
    } catch (error) {
      throw new BadRequestException('Invalid state');
    }

    const response = await this.service.handleMicrosoftCallback(code, clientId);

    res.redirect(`${returnUrl}?${response.message}`);
  }
}
