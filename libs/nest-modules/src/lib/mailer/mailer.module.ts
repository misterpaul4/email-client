import { Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account, Provider } from "@entities";

@Module({
  imports: [TypeOrmModule.forFeature([Account, Provider])],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
