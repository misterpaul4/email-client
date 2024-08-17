import { UserService } from "../service";
import { Controller } from "@nestjs/common";

@Controller("users")
export class UserController  {
  constructor(public service: UserService) {}
}
