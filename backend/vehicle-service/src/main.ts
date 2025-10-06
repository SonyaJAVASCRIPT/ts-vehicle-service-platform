import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')!],
      queue: configService.get<string>('VEHICLE_QUEUE')!,
      queueOptions: { durable: true },
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const CORS =
    configService.get<string>('FRONTEND_CORS_ORIGIN') ||
    'http://localhost:3000';
  app.enableCors({
    origin: CORS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('VEHICLE_SERVICE_PORT')!);
}
bootstrap();
