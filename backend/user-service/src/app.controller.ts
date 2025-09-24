import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @EventPattern('USER_CREATED')
  handleUserCreated(@Payload() data: any) {
    console.log('Data recieved: ', data);
  }
}
