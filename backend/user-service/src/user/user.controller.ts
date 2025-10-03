import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from 'src/dto/loginUser.dto';
interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private auth: AuthService,
  ) {}
  @Post()
  async user(@Body() body: CreateUserDto) {
    await this.userService.createUser(body);
    return await this.userService.login({
      email: body.email,
      password: body.password,
    } as LoginUserDto);
  }
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    return await this.userService.login(body);
  }
  @Get('/me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
