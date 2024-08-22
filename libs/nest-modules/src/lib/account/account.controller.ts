import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '@entities';

@Controller('accounts')
export class AccountController {
  constructor(private service: AccountService) {}

  @Get()
  getMany() {
    return this.service.getMany();
  }

  @Post()
  createAccount(@Body() dto: Account) {
    return this.service.createAccount(dto);
  }

  @Delete(':id')
  deleteAccount(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.deleteAccount(id);
  }
}
