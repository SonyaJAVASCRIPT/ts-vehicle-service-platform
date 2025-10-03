import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from 'src/dto/loginUser.dto';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}
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
    const user = await this.findUserByEmail(userdata.email);
    if (user) {
      throw new UnauthorizedException(
        `Користувач з ${userdata.email} вже існує`,
      );
    }
    const hashedPassword = await bcrypt.hash(userdata.password, saltRounds);
    return this.prisma.user.create({
      data: {
        ...userdata,
        password: hashedPassword,
      },
    });
  }
  async login(userData: LoginUserDto) {
    const user = await this.findUserByEmail(userData.email);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.auth.signIn(
      user.id,
      user.username,
      userData.password,
      user.password,
    );
  }
}
