import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Fintech API')
    .setDescription('Financial transaction API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // main.ts
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // allowedHeaders: ['Authorization', 'Content-Type'],
    // exposedHeaders: ['Authorization'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
