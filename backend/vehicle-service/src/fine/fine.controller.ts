import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto, UpdateFineDto } from 'src/dto/fines.dto';

@Controller('fine')
export class FineController {
  constructor(private readonly finesService: FineService) {}
  @Post(':vehicleId')
  create(@Param('vehicleId') vehicleId: string, @Body() dto: CreateFineDto) {
    return this.finesService.create(+vehicleId, dto);
  }

  @Get()
  findAll() {
    return this.finesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFineDto) {
    return this.finesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finesService.remove(+id);
  }
}
