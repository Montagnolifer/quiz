import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}
}
