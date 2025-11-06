import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      keepAliveTimeout: 60000,
      requestTimeout: 65000,
      trustProxy: true,
    }),
  );
  await app.register(multipart);
  await app.register(fastifyCors, {
    origin: process.env.HOST_WEB || 'http://localhost:7000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    // exposedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Fireant Stock API')
    .setDescription('API documentation for Fireant Stock application')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'some-secret',
    parseOptions: {},
  });

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
