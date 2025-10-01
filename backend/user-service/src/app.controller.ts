import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService, type UserData } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post()
  async user(@Body() body: UserData) {
    await this.appService.createUser(body);
    return 'Yeeey';
  }
  @Get()
  async getUsers(@Body() body: UserData) {
    return this.appService.createUser(body);
  }
  @Get()
  async getUserById(@Body() body: UserData) {
    return this.appService.createUser(body);
  }
  @Put()
  async putUserById(@Body() body: UserData) {
    return this.appService.createUser(body);
  }
  @Delete()
  async deleteUserById(@Body() body: UserData) {
    return this.appService.createUser(body);
  }
}
