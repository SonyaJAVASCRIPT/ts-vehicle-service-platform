import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async ifUserExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) return true;
    return false;
  }
  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
  async createUser(userdata: CreateUserDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userdata.password, saltRounds);
    return this.prisma.user.create({
      data: {
        ...userdata,
        password: hashedPassword,
      },
    });
  }
}
