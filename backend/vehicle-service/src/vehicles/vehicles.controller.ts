import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('vehicles')
export class VehiclesController {
  @EventPattern('USER_CREATED')
  handleUserCreated(@Payload() data: any) {
    console.log('Получено событие USER_CREATED:', data);
  }
}
