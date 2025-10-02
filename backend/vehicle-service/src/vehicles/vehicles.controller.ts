import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VehiclesService } from './vehicles.service';
export type RmqPayload = {
  id: number;
  username: string;
};

@Controller('vehicles')
export class VehiclesController {
  constructor(private vechicleService: VehiclesService) {}
  @EventPattern('USER_CREATED')
  async createUser(@Payload() data: RmqPayload) {
    await this.vechicleService.createUser(data);
  }
}
