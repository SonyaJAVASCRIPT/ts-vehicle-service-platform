import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('')
  async user(@Body() body: CreateUserDto) {
    await this.userService.createUser(body);
    return 'Yeeey';
  }
}
