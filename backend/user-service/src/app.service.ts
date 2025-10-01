import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async createUser(userdata: CreateUserDto) {
    await this.prisma.user.create({
      data: { email: userdata.email },
    });
  }
}
