import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const dbUrl = configService.get<string>('USER_DATABASE_URL');
    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
