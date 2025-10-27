import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateVehicleDto } from 'src/dto/vehicle.dto';
import { RmqPayload } from 'src/types/rabbitmq.type';
import { VehicleHelperService } from 'src/shared/vehicle-helper.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prismaService: PrismaService,
    private vehicleHelper: VehicleHelperService,
  ) {}

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
    await this.vehicleHelper.getVehicleByOwnerId(ownerId);

    return this.prismaService.vehicle.update({
      where: { ownerId },
      data,
    });
  }

  async remove(ownerId: number) {
    await this.vehicleHelper.getVehicleByOwnerId(ownerId);
    return this.prismaService.vehicle.delete({
      where: { ownerId },
    });
  }
}
