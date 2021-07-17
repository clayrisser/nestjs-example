/**
 * File: /src/modules/sofa/sofaOpenApi.provider.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-07-2021 20:48:48
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

import fs from 'fs-extra';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import { FactoryProvider } from '@nestjs/common';
import { OpenAPI, createSofaRouter } from '@codejamninja/sofa-api';
import { RouteInfo } from '@codejamninja/sofa-api/types';
import { SofaConfig } from '@codejamninja/sofa-api/sofa';
import { Pkg } from '~/types';
import { SOFA_CONFIG } from './sofaConfig.provider';
import { SOFA_GRAPHQL_SCHEMA, SofaOpenApi } from './types';

const rootPath = path.resolve(__dirname, '../../..');

export const SOFA_OPEN_API = 'SOFA_OPEN_API';

const OpenApiProvider: FactoryProvider<Promise<SofaOpenApi>> = {
  provide: SOFA_OPEN_API,
  inject: [SOFA_CONFIG, SOFA_GRAPHQL_SCHEMA],
  useFactory: async (sofaConfig: SofaConfig, schema: GraphQLSchema) => {
    const pkg: Pkg = JSON.parse(
      fs.readFileSync(path.resolve(rootPath, 'package.json')).toString()
    );
    const openApi = OpenAPI({
      schema,
      info: {
        description: pkg.description || '',
        title: pkg.name,
        version: pkg.version
      }
    });
    const clonedSofaConfig = { ...sofaConfig };
    clonedSofaConfig.onRoute = (info: RouteInfo) => {
      openApi.addRoute(info, { basePath: '/api' });
    };
    createSofaRouter(clonedSofaConfig);
    delete sofaConfig.onRoute;
    return openApi;
  }
};

export default OpenApiProvider;
