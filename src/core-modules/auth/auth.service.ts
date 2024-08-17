import { Injectable } from '@nestjs/common';
import { UserService } from '../../nest-modules/user';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
}
