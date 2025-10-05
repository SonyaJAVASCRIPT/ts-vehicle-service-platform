import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user-queue',
      queueOptions: { durable: true },
    },
  });
  app.enableCors({
    origin: 'http://localhost:3000', // разрешить все источники, можно заменить на конкретный URL
    credentials: true, // если нужны cookie
  });
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
