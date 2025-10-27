import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async createUser(data) {
    const v = await this.prisma.vehicle.findFirst({
      where: { ownerId: data.id },
    });
    if (v) {
      console.log('already exists');
      return v;
    }

    return await this.prisma.vehicle.create({
      data: {
        ownerId: data.id,
        plate: data.plate || null,
        brand: data.brand || null,
      },
    });
  }

  async findAll() {
    const res = await this.prisma.vehicle.findMany();
    console.log(res);
    return res;
  }

  async findOne(id) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { ownerId: +id },
    });
    return vehicle;
  }

  async update(id, dto) {
    const result = await this.prisma.vehicle.update({
      where: { ownerId: +id },
      data: dto,
    });
    return result;
  }

  async remove(id) {
    await this.prisma.vehicle.delete({
      where: { ownerId: +id },
    });
    console.log('deleted', id);
  }
}
