import { Crud, CrudController } from "@nestjsx/crud";
import { UserService } from "../service";
import { Controller } from "@nestjs/common";
import { User } from "entities";

@Crud({
  model: {
    type: User,
  },
})
@Controller("users")
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}
}