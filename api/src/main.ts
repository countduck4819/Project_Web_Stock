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

import passport from 'passport';
// import { googleExpress } from './modules/Auth/google-express';

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

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', (req: any, res: any, done: any) => {
      res.setHeader = (key: string, value: string) =>
        res.raw.setHeader(key, value);

      res.end = (data?: any) => {
        res.raw.end(data);
      };

      req.res = res;
      done();
    });

  await app.register(multipart);

  await app.register(fastifyCors, {
    origin: [
      'http://localhost:7000',
      'http://localhost:3000',
      'http://fireant.io.vn',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'some-secret',
    parseOptions: {},
  });

  app.use(passport.initialize());

  // app.use('/api', googleExpress);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import { AppModule } from './app.module';
// import fastifyCors from '@fastify/cors';
// import fastifyCookie from '@fastify/cookie';
// import multipart from '@fastify/multipart';
// import passport from 'passport';

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter(),
//   );

//   // Fastify → Express compatibility for Passport
//   app
//     .getHttpAdapter()
//     .getInstance()
//     .addHook('onRequest', (req: any, res: any, done: any) => {
//       res.setHeader = (key: string, value: string) =>
//         res.raw.setHeader(key, value);

//       res.end = (data?: any) => {
//         res.raw.end(data);
//       };

//       req.res = res;
//       done();
//     });

//   await app.register(multipart);
//   await app.register(fastifyCors, {
//     origin: ['http://localhost:7000'],
//     credentials: true,
//   });
//   await app.register(fastifyCookie);

//   app.use(passport.initialize());

//   app.setGlobalPrefix('api');

//   await app.listen(3000, '0.0.0.0');
// }

// bootstrap();

// main.ts - ĐƠN GIẢN HƠN
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';

// import fastifyCors from '@fastify/cors';
// import fastifyCookie from '@fastify/cookie';
// import multipart from '@fastify/multipart';

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter({
//       logger: true,
//       keepAliveTimeout: 60000,
//       requestTimeout: 65000,
//       trustProxy: true,
//     }),
//   );

//   app
//     .getHttpAdapter()
//     .getInstance()
//     .addHook('onRequest', (req: any, res: any, done: any) => {
//       res.setHeader = (key: string, value: string) =>
//         res.raw.setHeader(key, value);

//       res.end = (data?: any) => {
//         res.raw.end(data);
//       };

//       req.res = res;
//       done();
//     });

//   await app.register(multipart);

//   await app.register(fastifyCors, {
//     origin: ['http://localhost:7000', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });

//   await app.register(fastifyCookie, {
//     secret: process.env.COOKIE_SECRET || 'some-secret',
//     parseOptions: {},
//   });

//   app.useGlobalPipes(new ValidationPipe());
//   app.setGlobalPrefix('api');

//   const config = new DocumentBuilder()
//     .setTitle('Fireant Stock API')
//     .setDescription('API documentation for Fireant Stock application')
//     .setVersion('1.0.0')
//     .addBearerAuth({
//       type: 'http',
//       scheme: 'bearer',
//       bearerFormat: 'JWT',
//       name: 'Authorization',
//       description: 'Enter JWT token',
//       in: 'header',
//     })
//     .build();

//   const documentFactory = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, documentFactory);

//   await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
// }

// bootstrap();
