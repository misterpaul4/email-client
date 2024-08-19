import { Account } from "@entities";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateAccountDto extends PartialType(Account) {}
