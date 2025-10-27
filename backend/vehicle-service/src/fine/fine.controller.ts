import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FineService } from './fine.service';

@Controller('fine')
export class FineController {
  constructor(private fineService: FineService) {}

  @Post()
  create(@Body() dto: any) {
    return this.fineService.create(dto.vehicleId, dto);
  }

  @Get()
  getAll() {
    return this.fineService.findAll();
  }

  @Get(':id')
  get(@Param('id') id) {
    return this.fineService.findOne(id);
  }

  @Put(':id')
  edit(@Param('id') id, @Body() dto) {
    return this.fineService.update(id, dto);
  }

  @Delete(':id')
  del(@Param('id') id) {
    return this.fineService.remove(id);
  }
}
