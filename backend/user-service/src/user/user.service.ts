import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(userdata: CreateUserDto) {
    const emailExist = await this.prisma.user.findFirst({
      where: {
        email: userdata.email,
      },
    });
    if (emailExist) {
      return 'nah';
    }
    await this.prisma.user.create({
      data: userdata,
    });
  }
}
