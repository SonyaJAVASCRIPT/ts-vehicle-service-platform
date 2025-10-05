import { Module } from '@nestjs/common';
import { FineController } from './fine.controller';
import { FineService } from './fine.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FineController],
  providers: [FineService, PrismaService],
})
export class FineModule {}
