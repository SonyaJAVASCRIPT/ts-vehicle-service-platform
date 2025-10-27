import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private service: VehiclesService) {}

  @EventPattern('USER_CREATED')
  createUser(data: any) {
    console.log('user data:', data);
    this.service.createUser(data);
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id, @Body() dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.service.remove(id);
  }
}
