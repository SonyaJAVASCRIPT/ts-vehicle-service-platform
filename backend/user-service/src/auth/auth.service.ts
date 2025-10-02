import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async signIn(
    userId: number,
    userUsername: string,
    inputPassword: string,
    userPassword: string,
  ) {
    const compare = bcrypt.compareSync(inputPassword, userPassword);
    if (!compare) {
      throw new UnauthorizedException();
    }
    const payload = { sub: userId, username: userUsername };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
