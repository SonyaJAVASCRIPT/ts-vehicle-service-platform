import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
}

type RequestWithCookies = Request & { cookies?: Record<string, string> };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    let token = (request.cookies as Record<string, string> | undefined)?.[
      'token'
    ];
    if (!token) {
      const [type, headerToken] =
        request.headers['authorization']?.split(' ') ?? [];
      if (type === 'Bearer' && headerToken) {
        token = headerToken;
      }
    }
    if (!token) {
      throw new UnauthorizedException('Токен не найден');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(`Невалидный токен ${e}`);
    }
    return true;
  }
}
