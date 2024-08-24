import { Module } from '@nestjs/common';
import { OauthCallbackController } from './oauth-callback.controller';
import { OauthCallbackService } from './oauth-callback.service';

@Module({
  controllers: [OauthCallbackController],
  providers: [OauthCallbackService],
})
export class OauthCallbackModule {}
