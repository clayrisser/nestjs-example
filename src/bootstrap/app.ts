import getPort from 'get-port';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { Adapter } from '~/types';
import { AppModule } from '~/app.module';

const logger = console;
let port: number | null = null;

export async function createApp(adapter: Adapter) {
  const app = await NestFactory.create<
    NestExpressApplication | NestFastifyApplication
  >(
    AppModule,
    adapter === Adapter.Fastify ? new FastifyAdapter() : new ExpressAdapter(),
    { bodyParser: true }
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  if (configService.get('CORS') === '1') app.enableCors();
  return app;
}

export async function appListen(
  app: NestExpressApplication | NestFastifyApplication,
  adapter: Adapter
) {
  const configService = app.get(ConfigService);
  if (!port) {
    port = await getPort({
      port: Number(configService.get('PORT') || 3000)
    });
  }
  if (adapter === Adapter.Fastify) {
    const fastifyApp = app as NestFastifyApplication;
    await fastifyApp
      .listen(port, '0.0.0.0', () => {
        logger.info(`listening on port ${port}`);
      })
      .catch(logger.error);
  } else {
    const expressApp = app as NestExpressApplication;
    await expressApp
      .listen(port, '0.0.0.0', () => {
        logger.info(`listening on port ${port}`);
      })
      .catch(logger.error);
  }
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

declare const module: any;
