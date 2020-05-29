import getPort from 'get-port';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import pkg from '../package.json';

const logger = console;
const { env } = process;
if (!env.SECRET) env.SECRET = 'shhh';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  if (env.SWAGGER === '1') {
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription('appsaas core')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
  if (env.CORS === '1') app.enableCors();
  await app
    .listen(await getPort({ port: Number(env.PORT || 3000) }), () => {
      if (env.__NESTJS_ONLY_GENERATE === '1') app.close();
    })
    .catch((err: Error) => {
      logger.error(err);
      if (env.__NESTJS_ONLY_GENERATE === '1') app.close();
    });
})();
