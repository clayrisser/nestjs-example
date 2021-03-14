import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Adapter } from '~/types';

const rootPath = path.resolve(__dirname, '../..');

export async function registerEjs(
  app: NestExpressApplication | NestFastifyApplication,
  adapter: Adapter
) {
  if (adapter === Adapter.Fastify) {
    const ejs = await import('ejs');
    const fastifyApp = app as NestFastifyApplication;
    fastifyApp.useStaticAssets({
      root: path.join(__dirname, '../..', 'public'),
      prefix: '/public/'
    });
    fastifyApp.setViewEngine({
      engine: { handlebars: ejs },
      templates: path.join(__dirname, '../..', 'views')
    });
  } else {
    const expressApp = app as NestExpressApplication;
    expressApp.useStaticAssets(path.resolve(rootPath, 'public'));
    expressApp.setBaseViewsDir(path.resolve(rootPath, 'views'));
    expressApp.setViewEngine('ejs');
  }
}
