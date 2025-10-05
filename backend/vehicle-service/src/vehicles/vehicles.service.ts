import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RmqPayload } from './vehicles.controller';
import { UpdateVehicleDto } from 'src/dto/vehicle.dto';

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
  async findAll() {
    return this.prismaService.vehicle.findMany({
      include: { fines: true },
    });
  }

  async findOne(id: number) {
    return this.prismaService.vehicle.findUnique({
      where: { id },
      include: { fines: true },
    });
  }

  async update(id: number, data: UpdateVehicleDto) {
    return this.prismaService.vehicle.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prismaService.vehicle.delete({
      where: { id },
    });
  }
}
