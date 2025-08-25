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
    origin: [
      'https://fintech-frontend-tawny.vercel.app',
      'https://fintech-frontend-tawny.vercel.app/login',
      'https://fintech-frontend-tawny.vercel.app/dashboard',
      'http://localhost:3000',
      'http://localhost:3001' // For local testing
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Explicit OPTIONS handler for all routes
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(204).send();
    }
    next();
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
