// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';

// import fastifyExpress from '@fastify/express'; // ⬅ giữ nguyên
// import fastifyCors from '@fastify/cors';
// import fastifyCookie from '@fastify/cookie';
// import multipart from '@fastify/multipart';

// import passport from 'passport';
// import { setupGoogleStrategy } from './modules/Auth/google.strategy';
// import { googleExpress } from './modules/Auth/google-express';

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

//   // ❗❗❗ SỬA ĐÚNG CHỖ NÀY — express phải đăng ký ĐẦU TIÊN
//   await app.register(fastifyExpress);

//   // phần còn lại GIỮ NGUYÊN
//   await app.register(multipart);

//   await app.register(fastifyCors, {
//     origin: ['http://localhost:7000', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });

//   // init passport
//   app.use(passport.initialize());
//   setupGoogleStrategy();

//   // mount express route
//   app.use('/api', googleExpress);

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

//   await app.register(fastifyCookie, {
//     secret: process.env.COOKIE_SECRET || 'some-secret',
//     parseOptions: {},
//   });

//   const documentFactory = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, documentFactory);

//   await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
// }

// bootstrap();
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 🔥 PATCH Fastify → Express compatibility for Passport
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

  // app
  // .getHttpAdapter()
  // .getInstance()
  // .addHook('onRequest', (req: any, res: any, done: any) => {
  //   // Cho Passport dùng setHeader
  //   res.setHeader = (key: string, value: string) => {
  //     return res.raw.setHeader(key, value);
  //   };

  //   // Cho Passport dùng end()
  //   res.end = (data?: any) => {
  //     res.raw.end(data);
  //   };

  //   // 🔥 QUAN TRỌNG NHẤT — FIX REDIRECT
  //   res.redirect = (location: string) => {
  //     res.statusCode = 302;
  //     res.setHeader('Location', location);
  //     res.end();
  //   };

  //   req.res = res;
  //   done();
  // });

  await app.register(multipart);
  await app.register(fastifyCors, {
    origin: ['http://localhost:7000'],
    credentials: true,
  });
  await app.register(fastifyCookie);

  app.use(passport.initialize());

  app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
