import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FineModule } from './fine/fine.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    VehiclesModule,
    FineModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
