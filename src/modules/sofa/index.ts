/**
 * File: /src/modules/sofa/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-07-2021 20:50:55
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

import path from 'path';
import { ConfigModule } from '@nestjs/config';
import { GraphQLSchema } from 'graphql';
import { DynamicModule, Global, Module } from '@nestjs/common';
import SofaConfigProvider from './sofaConfig.provider';
import SofaErrorHandlerProvider from './sofaErrorHandler.provider';
import SofaOpenApiProvider from './sofaOpenApi.provider';
import { SOFA_GRAPHQL_SCHEMA } from './types';

const rootPath = path.resolve(__dirname, '../../../..');

@Global()
@Module({})
export default class SofaModule {
  public static register(schema: GraphQLSchema): DynamicModule {
    return {
      global: true,
      module: SofaModule,
      exports: [
        SofaConfigProvider,
        SofaErrorHandlerProvider,
        SofaOpenApiProvider
      ],
      imports: [
        ConfigModule.forRoot({
          envFilePath: path.resolve(rootPath, '.env')
        })
      ],
      providers: [
        SofaConfigProvider,
        SofaErrorHandlerProvider,
        SofaOpenApiProvider,
        { provide: SOFA_GRAPHQL_SCHEMA, useValue: schema }
      ]
    };
  }
}

export { SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider };

export * from './sofaConfig.provider';
export * from './sofaErrorHandler.provider';
export * from './sofaOpenApi.provider';
export * from './types';
