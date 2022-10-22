/**
 * File: /src/modules/core/logger/logger.ts
 * Project: app
 * File Created: 22-10-2022 06:38:15
 * Author: Clay Risser
 * -----
 * Last Modified: 22-10-2022 11:26:46
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

import Pino, { Logger, destination, multistream } from 'pino';
import chalk from 'chalk';
import path from 'path';
import pretty from 'pino-pretty';
import { ConfigService } from '@nestjs/config';
import { trace, context } from '@opentelemetry/api';

const { env } = process;

export function createLogger(config: ConfigService) {
  return Pino(
    {
      level: 'trace',
      formatters: {
        level(label) {
          return { level: label };
        },
        log(object) {
          const span = trace.getSpan(context.active());
          if (!span) return { ...object };
          const { spanId, traceId } = trace.getSpan(context.active())?.spanContext() || {};
          return { ...object, spanId, traceId };
        },
      },
    },
    multistream(
      [
        ...(config.get('DEBUG') === '1'
          ? [
              {
                stream: createPrettyStream(),
              },
              {
                level: 'error' as 'error',
                stream: createPrettyStream(process.stderr),
              },
            ]
          : [
              {
                stream: process.stdout,
              },
              {
                level: 'error' as 'error',
                stream: process.stderr,
              },
            ]),
        ...(env.LOG_FILE_NAME
          ? [
              {
                stream: createSonicBoom(path.resolve(process.cwd(), env.LOG_FILE_NAME)),
              },
              {
                level: 'error' as 'error',
                stream: createSonicBoom(path.resolve(process.cwd(), env.LOG_FILE_NAME)),
              },
            ]
          : []),
      ],
      {
        levels: {
          silent: Infinity,
          fatal: 60,
          error: 50,
          warn: 50,
          info: 30,
          debug: 20,
          trace: 10,
        },
        dedupe: true,
      },
    ),
  ) as Logger;
}

function createSonicBoom(dest: string) {
  return destination({ dest, append: true, sync: true });
}

function prettifierStr(data: string | object) {
  if (!data) return data;
  return data.toString();
}

function createPrettyStream(destination: NodeJS.WritableStream = process.stdout) {
  return pretty({
    colorize: true,
    sync: true,
    include: ['msg', 'traceId', 'spanId', 'context', 'time', 'req', 'res'].join(','),
    destination,
    customPrettifiers: {
      time: (_data: string | object) => {
        const date = new Date();
        return (
          chalk.bold(
            chalk.magentaBright(
              `${date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date
                .getMinutes()
                .toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date
                .getSeconds()
                .toLocaleString('en-US', { minimumIntegerDigits: 2 })}`,
            ),
          ) + chalk.magenta(`.${date.getMilliseconds().toLocaleString('en-US', { minimumIntegerDigits: 3 })}`)
        );
      },
      req: (data: string | object) => {
        if (!data) return data;
        const req = typeof data === 'string' ? JSON.parse(data) : data;
        return req.method && req.url ? `${req.method} ${req.url}${req.id ? ` id=${req.id}` : ''}` : '';
      },
      res: (data: string | object) => {
        if (!data) return data;
        const res = typeof data === 'string' ? JSON.parse(data) : data;
        return res.statusCode ? `status=${res.statusCode}` : '';
      },
      traceId: prettifierStr,
      spanId: prettifierStr,
      context: prettifierStr,
    },
  });
}
