import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FineModule } from './fine/fine.module';

@Module({
  imports: [VehiclesModule, FineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
