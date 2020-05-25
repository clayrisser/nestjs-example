import getPort from 'get-port';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import pkg from '../package.json';

const logger = console;

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.SWAGGER_ENABLE === '1') {
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription('appsass core')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);
  }
  if (process.env.CORS_ENABLE === '1') app.enableCors();
  await app
    .listen(
      await getPort({
        port: Number(process.env.PORT || 3000)
      }),
      () => {
        if (process.env.__NESTJS_ONLY_GENERATE === '1') app.close();
      }
    )
    .catch((err: Error) => {
      logger.error(err);
      if (process.env.__NESTJS_ONLY_GENERATE === '1') app.close();
    });
})();
