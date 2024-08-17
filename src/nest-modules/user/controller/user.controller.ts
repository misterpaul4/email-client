import { User } from "entities";
import { UserService } from "../service";
import { Controller, Get, Post, Body } from "@nestjs/common";

@Controller("users")
export class UserController  {
  constructor(public service: UserService) {}

  @Get()
  getMany() {
    return this.service.getMany()
  }
}
