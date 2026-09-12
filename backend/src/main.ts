import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Turns on automatic request validation using the rules in our DTOs.
  // whitelist: strip any fields we didn't explicitly allow (safer).
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // CORS lets the Angular app (running on a different port/origin) call this
  // API from the browser. We'll tighten the allowed origins before deploying.
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`PyTutor API running on http://localhost:${port}`);
}
await bootstrap();
