/**
 * File: /src/modules/sofa/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:36:11
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

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import GraphqlModule from '~/modules/graphql';
import SofaConfigProvider from './sofaConfig.provider';
import SofaErrorHandlerProvider from './sofaErrorHandler.provider';
import SofaMiddleware from './sofa.middleware';
import SofaOpenApiProvider from './sofaOpenApi.provider';
import SofaSwaggerMiddleware from './sofaSwagger.middleware';

@Module({
  exports: [SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider],
  imports: [GraphbackModule, GraphqlModule],
  providers: [SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider]
})
export default class SofaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SofaMiddleware)
      .forRoutes({ path: '/api', method: RequestMethod.ALL });
  }
}

export {
  SofaConfigProvider,
  SofaErrorHandlerProvider,
  SofaMiddleware,
  SofaOpenApiProvider,
  SofaSwaggerMiddleware
};

export * from './sofaConfig.provider';
export * from './sofaErrorHandler.provider';
export * from './sofaOpenApi.provider';
