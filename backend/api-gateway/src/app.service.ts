import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export type UserData = {
  id: string;
  email: string;
};

@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}
  async createUser(userdata: UserData) {
    await this.userClient
      .emit('USER_CREATED', {
        id: Date.now(),
        email: userdata.email,
      })
      .toPromise();
    return `user is created: ${userdata.id} ${userdata.email}`;
  }
}
