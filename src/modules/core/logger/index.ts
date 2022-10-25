/**
 * File: /src/modules/core/logger/index.ts
 * Project: app
 * File Created: 22-10-2022 06:38:15
 * Author: Clay Risser
 * -----
 * Last Modified: 25-10-2022 13:17:42
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

import { AxiosLoggerModule } from 'nestjs-axios-logger';
import { ConfigService } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common/interfaces';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Global, Module, RequestMethod } from '@nestjs/common';
import { createPinoHttp } from './logger';

const imports = [
  AxiosLoggerModule.registerAsync({
    inject: [ConfigService],
    useFactory(config: ConfigService) {
      return {
        data: config.get('LOG_AXIOS_DATA') === '1',
        headers: config.get('LOG_AXIOS_HEADERS') === '1',
        requestLogLevel: 'log',
        responseLogLevel: 'log',
      };
    },
  }),
];

@Global()
@Module({
  imports: [createPinoLoggerModule(), ...imports],
})
export class LoggerModule {
  public static register(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      imports: [createPinoLoggerModule(options), ...imports],
      global: true,
      module: LoggerModule,
    };
  }
}

export interface LoggerModuleOptions {
  color?: boolean;
  httpMixin?: (mergeObject: object, req: IncomingMessage, res: ServerResponse<IncomingMessage>) => object;
  ignore?: string[];
  mixin?: (mergeObject: object, level: number) => object;
  prettifiers?: Record<string, (data: string | object) => string>;
  strings?: string[];
}

function createPinoLoggerModule(options: LoggerModuleOptions = {}) {
  return PinoLoggerModule.forRootAsync({
    inject: [ConfigService],
    useFactory(config: ConfigService) {
      return {
        pinoHttp: createPinoHttp(config, options),
        exclude: [{ method: RequestMethod.ALL, path: 'health' }],
      };
    },
  });
}
