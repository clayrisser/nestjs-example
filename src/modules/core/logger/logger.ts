/**
 * File: /src/modules/core/logger/logger.ts
 * Project: app
 * File Created: 22-10-2022 06:38:15
 * Author: Clay Risser
 * -----
 * Last Modified: 25-10-2022 15:38:59
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2022
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

import type { Logger } from 'pino';
import Pino, { destination, multistream } from 'pino';
import chalk from 'chalk';
import httpStatus from 'http-status';
import path from 'path';
import pretty from 'pino-pretty';
import type { ConfigService } from '@nestjs/config';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Options as PinoHttpOptions } from 'pino-http';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { trace, context } from '@opentelemetry/api';
import type { LoggerModuleOptions } from './index';

export function createPinoHttp(config: ConfigService, options: LoggerModuleOptions): PinoHttpOptions {
  return {
    logger: createLogger(config, options),
    genReqId: function (request: IncomingMessage, response: ServerResponse) {
      const req = request as Request;
      const res = response as Response;
      if (req.id) return req.id;
      let id = req.get('X-Request-Id');
      if (id) return id;
      id = randomUUID();
      res.header('X-Request-Id', id);
      return id;
    },
    customProps(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
      const result = { id: req.id };
      if (options.httpMixin) return options.httpMixin(result, req, res);
      return result;
    },
  };
}

function createLogger(config: ConfigService, options: LoggerModuleOptions) {
  const logFileName = config.get('LOG_FILE_NAME');
  return Pino(
    {
      level: 'trace',
      mixin(obj: any, _level: number) {
        return obj;
      },
      formatters: {
        level(label) {
          return { level: label };
        },
        log(obj) {
          delete obj.trace_id;
          delete obj.span_id;
          if (obj.trace_flags) {
            obj.traceFlags = obj.trace_flags;
            delete obj.trace_flags;
          }
          const span = trace.getSpan(context.active());
          if (!span) return { ...obj };
          const { spanId, traceId } = trace.getSpan(context.active())?.spanContext() || {};
          return { ...obj, spanId, traceId };
        },
      },
    },
    multistream(
      [
        ...(config.get('CONTAINER') !== '1' || config.get('LOG_FILE_NAME') || config.get('LOG_PRETTY') === '1'
          ? [
              {
                stream: createPrettyStream(options),
              },
              {
                level: 'error' as 'error',
                stream: createPrettyStream(options, process.stderr),
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
        ...(logFileName
          ? [
              {
                stream: createSonicBoom(path.resolve(process.cwd(), logFileName)),
              },
              {
                level: 'error' as 'error',
                stream: createSonicBoom(path.resolve(process.cwd(), logFileName)),
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
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data);
    } catch (err) {}
  }
  return data.toString();
}

function createPrettyStream(options: LoggerModuleOptions, destination: NodeJS.WritableStream = process.stdout) {
  return pretty({
    minimumLevel: 'trace',
    colorize: true,
    sync: true,
    mkdir: true,
    ignore: ['span_id', 'traceFlags', 'trace_flags', 'trace_id', ...(options.ignore ? options.ignore : [])].join(','),
    destination,
    errorLikeObjectKeys: ['error', 'err'],
    customPrettifiers: {
      time(data: string | object) {
        if (!data) return data;
        if (typeof data !== 'string' || data.split('.').length < 2) {
          const date = new Date();
          return colorTime(
            `${date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date
              .getMinutes()
              .toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date
              .getSeconds()
              .toLocaleString('en-US', { minimumIntegerDigits: 2 })}`,
            `.${date.getMilliseconds().toLocaleString('en-US', { minimumIntegerDigits: 3 })}`,
            options.color,
          );
        }
        const [time, milli] = data.split('.');
        return colorTime(time, milli, options.color);
      },
      req(data: string | object) {
        if (!data) return data;
        const req = typeof data === 'string' ? JSON.parse(data) : data;
        return req.method && req.url ? `${req.method} ${req.url}${req.id ? ` id=${req.id}` : ''}` : '';
      },
      res(data: string | object) {
        if (!data) return data;
        const res = typeof data === 'string' ? JSON.parse(data) : data;
        return res.statusCode ? `status=${formatStatus(res.statusCode, options.color)}` : '';
      },
      method(data: string | object) {
        if (!data) return data;
        if (options.color) {
          return chalk.bold(chalk.gray(data.toString()));
        }
        return data.toString();
      },
      status(data: string | object) {
        if (!data) return data;
        return formatStatus(data.toString(), options.color);
      },
      kind(data: string | object) {
        if (!data) return data;
        if (options.color) {
          switch (data) {
            case 'HTTP_REQUEST': {
              return chalk.underline(chalk.italic(data));
            }
            case 'HTTP_RESPONSE': {
              return chalk.underline(chalk.bold(data));
            }
            case 'HTTP_ERROR': {
              return chalk.redBright(chalk.underline(chalk.bold(data)));
            }
          }
        }
        return prettifierStr(data);
      },
      ...Object.fromEntries(
        ['context', 'id', 'spanId', 'traceId', 'url', ...(options.strings ? options.strings : [])].map((key) => [
          key,
          prettifierStr,
        ]),
      ),
      ...(options.prettifiers ? options.prettifiers : {}),
    },
  });
}

function colorTime(time: string, milli: string, color = false) {
  if (!color) return `${time}.${milli}`;
  return chalk.bold(chalk.magentaBright(time)) + chalk.magenta(`.${milli}`);
}

function formatStatus(status: number | string, color = false) {
  const statusName = httpStatus[`${status}_NAME`];
  status = `${status}${statusName ? ':' + statusName : ''}`;
  if (color) {
    switch (parseInt(status[0], 10)) {
      case 2: {
        return chalk.greenBright(status);
      }
      case 3: {
        return chalk.greenBright(status);
      }
      case 4: {
        return chalk.yellowBright(status);
      }
      case 5: {
        return chalk.redBright(status);
      }
    }
  }
  return status;
}
