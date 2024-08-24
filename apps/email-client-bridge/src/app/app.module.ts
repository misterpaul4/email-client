import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthCallbackModule } from '@nest-modules';

@Module({
  imports: [OauthCallbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
