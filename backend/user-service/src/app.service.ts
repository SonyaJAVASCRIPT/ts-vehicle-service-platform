import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
export type UserData = {
  email: string;
};

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async createUser(userdata: UserData) {
    await this.prisma.user.create({
      data: { email: userdata.email },
    });
  }
}
