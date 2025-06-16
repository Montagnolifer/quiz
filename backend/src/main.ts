import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilita CORS para o frontend (porta 3001)
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
