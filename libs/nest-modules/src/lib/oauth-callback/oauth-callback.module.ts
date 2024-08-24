import { Module } from '@nestjs/common';
import { OauthCallbackController } from './oauth-callback.controller';
import { OauthCallbackService } from './oauth-callback.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [OauthCallbackController],
  providers: [OauthCallbackService],
})
export class OauthCallbackModule {}
