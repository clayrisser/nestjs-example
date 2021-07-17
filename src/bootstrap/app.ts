/**
 * File: /src/bootstrap/app.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 17-07-2021 04:37:36
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import getPort from 'get-port';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { Adapter } from '~/types';
import { AppModule } from '~/app';

const logger = new Logger('Bootstrap');
let port: number | null = null;
const { env } = process;

export async function createApp(
  adapter: Adapter
): Promise<NestExpressApplication | NestFastifyApplication> {
  let logLevels = (env.LOG_LEVELS || '').split(',') as LogLevel[];
  if (!logLevels.length || !!Number(env.DEBUG)) {
    logLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
  }
  const app = await NestFactory.create<
    NestExpressApplication | NestFastifyApplication
  >(
    AppModule,
    adapter === Adapter.Fastify ? new FastifyAdapter() : new ExpressAdapter(),
    { bodyParser: true, logger: logLevels }
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  if (configService.get('CORS') === '1') app.enableCors();
  return app;
}

export async function appListen(
  app: NestExpressApplication | NestFastifyApplication
) {
  const configService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const platformName = httpAdapter.getType();
  if (!port) {
    port = await getPort({
      port: Number(configService.get('PORT') || 3000)
    });
  }
  switch (platformName) {
    case Adapter.Express: {
      const expressApp = app as NestExpressApplication;
      await expressApp
        .listen(port, '0.0.0.0', () => {
          logger.log(`listening on port ${port}`);
        })
        .catch(logger.error);
      break;
    }
    case Adapter.Fastify: {
      const fastifyApp = app as NestFastifyApplication;
      await fastifyApp
        .listen(port, '0.0.0.0', () => {
          logger.log(`listening on port ${port}`);
        })
        .catch(logger.error);
      break;
    }
    default: {
      throw new Error(`No support for current HttpAdapter: ${platformName}`);
    }
  }
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

declare const module: any;
