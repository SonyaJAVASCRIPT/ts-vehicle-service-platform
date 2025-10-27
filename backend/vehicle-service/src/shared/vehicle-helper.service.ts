import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VehicleHelperService {
  constructor(private prismaService: PrismaService) {}

  async getVehicleByOwnerId(ownerId: number) {
    const vehicle = await this.prismaService.vehicle.findUnique({
      where: { ownerId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ownerId ${ownerId} not found`);
    }

    return vehicle;
  }
}
