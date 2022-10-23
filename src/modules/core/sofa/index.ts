/**
 * File: /src/modules/core/sofa/index.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 23-10-2022 03:52:03
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

import { DynamicModule, Global, Module } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { SOFA_GRAPHQL_SCHEMA } from './types';
import { SofaConfigProvider } from './sofaConfig.provider';
import { SofaErrorHandlerProvider } from './sofaErrorHandler.provider';
import { SofaOpenApiProvider } from './sofaOpenApi.provider';

@Global()
@Module({})
export class SofaModule {
  public static register(schema: GraphQLSchema): DynamicModule {
    return {
      global: true,
      module: SofaModule,
      exports: [SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider],
      providers: [
        SofaConfigProvider,
        SofaErrorHandlerProvider,
        SofaOpenApiProvider,
        { provide: SOFA_GRAPHQL_SCHEMA, useValue: schema },
      ],
    };
  }
}

export * from './sofaConfig.provider';
export * from './sofaErrorHandler.provider';
export * from './sofaOpenApi.provider';
export * from './types';
