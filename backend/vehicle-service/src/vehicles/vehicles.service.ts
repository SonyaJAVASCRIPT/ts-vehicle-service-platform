import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RmqPayload } from './vehicles.controller';
import { UpdateVehicleDto } from 'src/dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prismaService: PrismaService) {}
  async createUser(data: RmqPayload) {
    const existingVehicle = await this.prismaService.vehicle.findUnique({
      where: { ownerId: data.id },
    });
    if (existingVehicle) {
      return existingVehicle;
    }
    return this.prismaService.vehicle.create({
      data: {
        ownerId: data.id,
        plate: '',
        brand: '',
      },
    });
  }

  async findAll() {
    return this.prismaService.vehicle.findMany({
      include: { fines: true },
    });
  }

  async findOne(ownerId: number) {
    return this.prismaService.vehicle.findUnique({
      where: { ownerId },
      include: { fines: true },
    });
  }

  async update(ownerId: number, data: UpdateVehicleDto) {
    const vehicle = await this.prismaService.vehicle.findUnique({
      where: { ownerId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ownerId ${ownerId} not found`);
    }
    const updated = await this.prismaService.vehicle.update({
      where: { ownerId },
      data,
    });
    return updated;
  }

  async remove(ownerId: number) {
    return this.prismaService.vehicle.delete({
      where: { ownerId },
    });
  }
}
