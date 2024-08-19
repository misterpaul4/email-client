import { Controller, Get } from "@nestjs/common";
import { AccountService } from "./account.service";

@Controller('accounts')
export class AccountController {

  constructor(
    private service: AccountService
  ) {}

  @Get()
  getMany() {
    return this.service.getMany()
  }
}
