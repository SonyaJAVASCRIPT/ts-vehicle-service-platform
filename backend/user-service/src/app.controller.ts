import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/user')
  async user(@Body() body: CreateUserDto) {
    await this.appService.createUser(body);
    return 'Yeeey';
  }
  @Get('/user')
  async getUsers(@Body() body: CreateUserDto) {
    return this.appService.createUser(body);
  }
  @Get()
  async getUserById(@Body() body: CreateUserDto) {
    return this.appService.createUser(body);
  }
  @Put()
  async putUserById(@Body() body: CreateUserDto) {
    return this.appService.createUser(body);
  }
  @Delete()
  async deleteUserById(@Body() body: CreateUserDto) {
    return this.appService.createUser(body);
  }
}
