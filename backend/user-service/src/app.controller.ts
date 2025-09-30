import { Body, Controller, Post } from '@nestjs/common';
import { AppService, type UserData } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() body: UserData) {
    return this.appService.createUser(body);
  }
}
