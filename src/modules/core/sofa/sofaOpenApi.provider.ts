/**
 * File: /src/modules/core/sofa/sofaOpenApi.provider.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 25-10-2022 06:25:56
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

import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { OpenAPI, createRouter, SofaConfig, createSofa } from '@risserlabs/sofa-api';
import { OpenAPIV3 } from 'openapi-types';
import { RouteInfo } from '@risserlabs/sofa-api';
import pkg from 'app/../package.json';
import { SOFA_CONFIG } from './sofaConfig.provider';
import { SOFA_GRAPHQL_SCHEMA } from './types';

export const SOFA_OPEN_API = 'SOFA_OPEN_API';

export const SofaOpenApiProvider: FactoryProvider<Promise<SofaOpenApi>> = {
  provide: SOFA_OPEN_API,
  inject: [SOFA_CONFIG, SOFA_GRAPHQL_SCHEMA, ConfigService],
  useFactory: async (sofaConfig: SofaConfig, schema: GraphQLSchema, config: ConfigService) => {
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
      openApi.addRoute(info, { basePath: config.get('SOFA_BASE_PATH') || '/sofa' });
    };
    createRouter(createSofa(clonedSofaConfig));
    delete sofaConfig.onRoute;
    return openApi;
  },
};

export interface SofaOpenApi {
  addRoute: (
    info: RouteInfo,
    config?: {
      basePath?: string;
    },
  ) => void;
  get: () => OpenAPIV3.Document<{}>;
}
