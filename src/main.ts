import ConnectRedis from 'connect-redis';
import dotenv from 'dotenv';
import fs from 'fs';
import getPort from 'get-port';
import passport from 'passport';
import path from 'path';
import redis from 'redis';
import session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import pkg from '../package.json';
import { AppModule } from './app.module';

const logger = console;
const rootPath = path.resolve(__dirname, '../..');
dotenv.config();
process.env = {
  ...process.env,
  ...dotenv.parse(fs.readFileSync(path.resolve(rootPath, 'prisma/.env')))
};
const { env } = process;

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true
  });
  app.setBaseViewsDir(path.resolve(rootPath, 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.resolve(rootPath, 'public'));
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
      secret: env['SECRET'],
      store: createRedisStore()
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req: any, _res: any, next: any) => {
    console.log(req.session);
    return next();
  });
  if (env.SWAGGER === '1') {
    const options = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
  if (env.CORS === '1') app.enableCors();
  await app
    .listen(await getPort({ port: Number(env.PORT || 3000) }))
    .catch(logger.error);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
})();

declare const module: any;

export function createRedisStore() {
  const RedisStore = ConnectRedis(session);
  const redisClient = redis.createClient();
  return new RedisStore({ client: redisClient as any });
}
