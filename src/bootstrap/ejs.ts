import path from 'path';
import { HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Adapter } from '~/types';

const rootPath = path.resolve(__dirname, '../..');

export async function registerEjs(
  app: NestExpressApplication | NestFastifyApplication
) {
  const { httpAdapter } = app.get(HttpAdapterHost);
  const platformName = httpAdapter.getType();
  switch (platformName) {
    case Adapter.Express: {
      const expressApp = app as NestExpressApplication;
      expressApp.useStaticAssets(path.resolve(rootPath, 'public'));
      expressApp.setBaseViewsDir(path.resolve(rootPath, 'views'));
      expressApp.setViewEngine('ejs');
      break;
    }
    case Adapter.Fastify: {
      const ejs = await import('ejs');
      const fastifyApp = app as NestFastifyApplication;
      fastifyApp.useStaticAssets({
        root: path.join(rootPath, 'public'),
        prefix: '/public/'
      });
      fastifyApp.setViewEngine({
        engine: { handlebars: ejs },
        templates: path.join(rootPath, 'views')
      });
      break;
    }
    default: {
      throw new Error(`No support for current HttpAdapter: ${platformName}`);
    }
  }
}
