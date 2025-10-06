import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from './user.service';
import { type Response } from 'express';
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
  async user(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.createUser(body);
    const { access_token, username, id } = await this.userService.login({
      email: body.email,
      password: body.password,
    } as LoginUserDto);
    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return { username, id };
  }
  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, username, id } = await this.userService.login(body);
    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return { username, id };
  }
  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
