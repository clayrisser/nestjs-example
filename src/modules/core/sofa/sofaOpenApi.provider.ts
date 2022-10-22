/**
 * File: /src/modules/core/sofa/sofaOpenApi.provider.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-10-2022 09:14:52
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

import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { OpenAPI, createSofaRouter } from '@risserlabs/sofa-api';
import { RouteInfo } from '@risserlabs/sofa-api/dist/types';
import { SofaConfig } from '@risserlabs/sofa-api/dist/sofa';
import { SOFA_CONFIG } from './sofaConfig.provider';
import { SOFA_GRAPHQL_SCHEMA, SofaOpenApi } from './types';
import pkg from 'app/../package.json';

export const SOFA_OPEN_API = 'SOFA_OPEN_API';

export const SofaOpenApiProvider: FactoryProvider<Promise<SofaOpenApi>> = {
  provide: SOFA_OPEN_API,
  inject: [SOFA_CONFIG, SOFA_GRAPHQL_SCHEMA],
  useFactory: async (sofaConfig: SofaConfig, schema: GraphQLSchema) => {
    const openApi = OpenAPI({
      schema,
      info: {
        description: pkg.description || '',
        title: pkg.name,
        version: pkg.version,
      },
    });
    const clonedSofaConfig = { ...sofaConfig };
    clonedSofaConfig.onRoute = (info: RouteInfo) => {
      openApi.addRoute(info, { basePath: '/api' });
    };
    createSofaRouter(clonedSofaConfig as unknown as SofaConfig);
    delete sofaConfig.onRoute;
    return openApi;
  },
};
