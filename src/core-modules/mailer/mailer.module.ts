import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailerService } from "./service";

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
