import { Module } from "@nestjs/common";
import { UserController } from "./controller";
import { UserService } from "./service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "entities";


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  exports: [UserService],
})
export class UserModule {}
