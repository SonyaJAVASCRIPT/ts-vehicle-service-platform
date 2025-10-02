import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { type RmqPayload } from './vehicles.controller';

@Injectable()
export class VehiclesService {
  constructor(private prismaService: PrismaService) {}
  async createUser(data: RmqPayload) {
    await this.prismaService.vehicle.create({
      data: {
        ownerId: data.id,
        plate: '',
        brand: '',
      },
    });
  }
}
