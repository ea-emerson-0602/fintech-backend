import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fintech API')
    .setDescription('Financial transaction API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    app.enableCors();
    // app.enableCors({
    //   origin: 'http://localhost:3001', // your frontend port
    //   credentials: true, // if you're sending cookies or Authorization headers
    // });
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap()