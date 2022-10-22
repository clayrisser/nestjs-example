/**
 * File: /src/bootstrap/app.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-10-2022 08:43:42
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dotenv from 'dotenv';
import getPort from 'get-port';
import path from 'path';
import { AppModule } from 'app/app.module';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, NestApplicationOptions } from '@nestjs/common';
import { logLevels, registerEjs, registerLogger, registerMiscellaneous, registerSofa, registerSwagger } from './index';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const logger = new Logger('Bootstrap');
let app: NestExpressApplication;
const bootstrappedEvents: BootstrapEventHandler[] = [];
let port: number | null = null;

export async function createApp(options: NestApplicationOptions = {}): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    bodyParser: true,
    logger: logLevels,
    ...options,
  });
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  if (configService.get('CORS') === '1') {
    app.enableCors({ origin: '*' });
  }
  return app;
}

export async function appListen(app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  if (!port) {
    port = await getPort({
      port: Number(configService.get('PORT') || 3000),
    });
  }
  await app
    .listen(port, '0.0.0.0', () => {
      logger.log(`listening on port ${port}`);
    })
    .catch(logger.error);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

export async function start() {
  app = await createApp();
  await app.init();
  const { schema } = app.get(GraphQLSchemaHost);
  await app.close();
  app = await createApp({ bufferLogs: false });
  await registerLogger(app);
  const sofa = await registerSofa(app, schema);
  await registerEjs(app);
  await registerSwagger(app, sofa);
  await registerMiscellaneous(app);
  const p = appListen(app);
  await emitBootstrapped(app);
  await p;
}

export async function stop() {
  if (!app) return;
  await app.close();
}

export async function restart() {
  await stop();
  await start();
}

export function onBootstrapped(eventHandler: BootstrapEventHandler) {
  bootstrappedEvents.push(eventHandler);
}

async function emitBootstrapped(app: NestExpressApplication) {
  const clonedBootstrappedEvents = [...bootstrappedEvents];
  bootstrappedEvents.splice(0, bootstrappedEvents.length);
  await new Promise((r) => setTimeout(r, 1000, null));
  clonedBootstrappedEvents.forEach((eventHandler: BootstrapEventHandler) => eventHandler(app));
}

declare const module: any;

export type BootstrapEventHandler = (app: NestExpressApplication) => unknown;
