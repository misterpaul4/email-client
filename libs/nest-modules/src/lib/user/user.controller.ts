import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {

  constructor(
    private service: UserService
  ) {}

  @Get()
  getMany() {
    return this.service.getMany()
  }
}
