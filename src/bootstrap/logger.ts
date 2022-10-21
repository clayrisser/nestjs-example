/**
 * File: /src/bootstrap/logger.ts
 * Project: example-nestjs
 * File Created: 04-01-2022 05:00:58
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-10-2022 13:46:57
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

import { LogLevel } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';

const { env } = process;

export async function registerLogger(app: NestExpressApplication) {
  app.useLogger(app.get(PinoLogger));
}

export let logLevels = (env.LOG_LEVELS || '').split(',') as LogLevel[];
if (!logLevels.length || !!Number(env.DEBUG)) {
  logLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
}
