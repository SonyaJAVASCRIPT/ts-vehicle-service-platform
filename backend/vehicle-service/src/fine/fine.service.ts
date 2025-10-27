import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FineService {
  constructor(private prisma: PrismaService) {}

  async create(id, dto) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { ownerId: id },
    });

    if (!vehicle) {
      throw 'no vehicle';
    }

    const fine = await this.prisma.fine.create({
      data: {
        date: dto.date,
        description: dto.desc || '',
        amount: dto.amount,
        status: dto.status,
        vehicleId: vehicle.id,
      },
    });

    console.log('fine created', fine);
    return fine;
  }

  async findAll(id?) {
    let fines = [];
    if (id) {
      const v = await this.prisma.vehicle.findFirst({ where: { ownerId: id } });
      if (v) {
        fines = await this.prisma.fine.findMany({ where: { vehicleId: v.id } });
      } else {
        return [];
      }
    } else {
      fines = await this.prisma.fine.findMany();
    }
    return fines;
  }

  async findOne(id) {
    return this.prisma.fine.findUnique({ where: { id } });
  }

  async update(id, dto) {
    return this.prisma.fine.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id) {
    try {
      await this.prisma.fine.delete({ where: { id } });
      console.log('fine deleted');
    } catch (e) {
      console.log('error', e);
    }
  }
}
