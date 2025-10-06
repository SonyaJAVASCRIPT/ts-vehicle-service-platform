import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VehiclesService } from './vehicles.service';
import { UpdateVehicleDto } from 'src/dto/vehicle.dto';
export type RmqPayload = {
  id: number;
  username: string;
};

@Controller('vehicles')
export class VehiclesController {
  constructor(private vechicleService: VehiclesService) {}
  @EventPattern('USER_CREATED')
  async createUser(@Payload() data: RmqPayload) {
    console.log(data);
    await this.vechicleService.createUser(data);
  }
  @Get()
  findAll() {
    return this.vechicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.vechicleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateVehicleDto) {
    return this.vechicleService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.vechicleService.remove(+id);
  }
}
