import { Injectable } from '@nestjs/common';
import { CreateFineDto, UpdateFineDto } from 'src/dto/fines.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FineService {
  constructor(private prismaService: PrismaService) {}

  async create(vehicleId: number, dto: CreateFineDto) {
    return this.prismaService.fine.create({
      data: {
        date: dto.date,
        description: dto.description,
        amount: dto.amount,
        status: dto.status ?? false,
        vehicle: { connect: { id: vehicleId } },
      },
    });
  }

  async findAll(vehicleId?: number) {
    if (vehicleId) {
      return this.prismaService.fine.findMany({
        where: { vehicleId },
      });
    }
    return this.prismaService.fine.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.fine.findUnique({
      where: { id },
    });
  }

  async update(id: number, dto: UpdateFineDto) {
    return this.prismaService.fine.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: number) {
    return this.prismaService.fine.delete({
      where: { id },
    });
  }
}
