/**
 * File: /src/modules/core/logger/index.ts
 * Project: app
 * File Created: 22-10-2022 06:38:15
 * Author: Clay Risser
 * -----
 * Last Modified: 22-10-2022 10:54:27
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

import { IncomingMessage, ServerResponse } from 'http';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Module, RequestMethod } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createLogger } from './logger';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          pinoHttp: {
            logger: createLogger(config),
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
          },
          exclude: [{ method: RequestMethod.ALL, path: 'health' }],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class LoggerModule {}
