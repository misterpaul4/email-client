import { Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { ProviderModule } from "../provider";
import { AccountModule } from "../account";

@Module({
  imports: [AccountModule],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
