import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //прибирає зайві поля, що приходять в реквесті, якщо вони не описані в дто
      whitelist: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
