import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFineDto, UpdateFineDto } from 'src/dto/fines.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FineService {
  constructor(private prismaService: PrismaService) {}

  async create(ownerId: number, dto: CreateFineDto) {
    const vehicle = await this.prismaService.vehicle.findUnique({
      where: { ownerId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle for ownerId ${ownerId} not found`);
    }

    return this.prismaService.fine.create({
      data: {
        date: dto.date,
        description: dto.description,
        amount: dto.amount,
        status: dto.status ?? false,
        vehicle: { connect: { id: vehicle.id } },
      },
    });
  }

  async findAll(ownerId?: number) {
    if (ownerId) {
      const vehicle = await this.prismaService.vehicle.findUnique({
        where: { ownerId },
      });

      if (!vehicle) {
        throw new NotFoundException(`Vehicle for ownerId ${ownerId} not found`);
      }

      return this.prismaService.fine.findMany({
        where: { vehicleId: vehicle.id },
      });
    }

    return this.prismaService.fine.findMany();
  }

  async findOne(id: number) {
    const fine = await this.prismaService.fine.findUnique({
      where: { id },
    });

    if (!fine) {
      throw new NotFoundException(`Fine with id ${id} not found`);
    }

    return fine;
  }

  async update(id: number, dto: UpdateFineDto) {
    const fine = await this.prismaService.fine.findUnique({ where: { id } });

    if (!fine) {
      throw new NotFoundException(`Fine with id ${id} not found`);
    }

    return this.prismaService.fine.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: number) {
    const fine = await this.prismaService.fine.findUnique({ where: { id } });

    if (!fine) {
      throw new NotFoundException(`Fine with id ${id} not found`);
    }

    return this.prismaService.fine.delete({
      where: { id },
    });
  }
}
