import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('USER_SERVICE_PORT') || 3002;
  const CORS =
    configService.get<string>('FRONTEND_CORS_ORIGIN') ||
    'http://localhost:3000';
  app.enableCors({
    origin: CORS,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use((cookieParser as unknown as () => any)());
  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
