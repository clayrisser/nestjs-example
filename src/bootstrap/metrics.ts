/**
 * File: /src/bootstrap/opentelemetry.ts
 * Project: example-nestjs
 * File Created: 24-07-2021 00:59:44
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 24-07-2021 01:08:06
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
import { LogLevel, Logger } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { Adapter } from '~/types';
import { MetricsModule } from '~/modules/openTelemetry';

const logger = new Logger('Bootstrap');
let port: number | null = null;
const { env } = process;

export async function createMetricsApp(
  adapter: Adapter
): Promise<NestExpressApplication | NestFastifyApplication> {
  let logLevels = (env.LOG_LEVELS || '').split(',') as LogLevel[];
  if (!logLevels.length || !!Number(env.DEBUG)) {
    logLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
  }
  return NestFactory.create<NestExpressApplication | NestFastifyApplication>(
    MetricsModule,
    adapter === Adapter.Fastify ? new FastifyAdapter() : new ExpressAdapter(),
    { bodyParser: true, logger: logLevels }
  );
}

export async function metricsAppListen(
  metricsApp: NestExpressApplication | NestFastifyApplication
) {
  const configService = metricsApp.get(ConfigService);
  const { httpAdapter } = metricsApp.get(HttpAdapterHost);
  const platformName = httpAdapter.getType();
  if (!port) {
    port = await getPort({
      port: Number(configService.get('METRICS_PORT') || 9090)
    });
  }
  switch (platformName) {
    case Adapter.Express: {
      const expressApp = metricsApp as NestExpressApplication;
      await expressApp
        .listen(port, '0.0.0.0', () => {
          logger.log(`metrics listening on port ${port}`);
        })
        .catch(logger.error);
      break;
    }
    case Adapter.Fastify: {
      const fastifyApp = metricsApp as NestFastifyApplication;
      await fastifyApp
        .listen(port, '0.0.0.0', () => {
          logger.log(`metrics listening on port ${port}`);
        })
        .catch(logger.error);
      break;
    }
    default: {
      throw new Error(`no support for http adapter '${platformName}'`);
    }
  }
}
