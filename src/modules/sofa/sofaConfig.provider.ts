/**
 * File: /src/modules/sofa/sofaConfig.provider.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-10-2022 05:40:40
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

import { ErrorHandler } from '@risserlabs/sofa-api/dist/express';
import { FactoryProvider } from '@nestjs/common';
import { OperationDefinitionNode, GraphQLSchema } from 'graphql';
import { SofaConfig } from '@risserlabs/sofa-api/dist/sofa';
import { Method } from '@risserlabs/sofa-api/dist/types';
import { SOFA_ERROR_HANDLER } from './sofaErrorHandler.provider';
import { SOFA_GRAPHQL_SCHEMA } from './types';

type Kind = any;

export const SOFA_CONFIG = 'SOFA_CONFIG';

export const SofaConfigProvider: FactoryProvider<Promise<SofaConfig>> = {
  provide: SOFA_CONFIG,
  inject: [SOFA_ERROR_HANDLER, SOFA_GRAPHQL_SCHEMA],
  useFactory: async (sofaErrorHandler: ErrorHandler, schema: GraphQLSchema) =>
    ({
      schema,
      basePath: '/api',
      method: {},
      name: {},
      calculateMethod(method: Method, kind: Kind, { name }: OperationDefinitionNode) {
        switch (kind) {
          case 'query': {
            return 'GET';
          }
          case 'mutation': {
            if (/^delete/.test(name?.value || '')) {
              return 'DELETE';
            }
            if (/^update/.test(name?.value || '')) {
              return 'PUT';
            }
            if (/^create/.test(name?.value || '')) {
              return 'POST';
            }
            if (/^mutation/.test(name?.value || '')) {
              return 'POST';
            }
            break;
          }
        }
        return method;
      },
      calculatePath(path: string, kind: Kind, _operationDefinitionNode: OperationDefinitionNode) {
        let newPath = path;
        switch (kind) {
          case 'query': {
            newPath = path.replace(/^\/find-/g, '/');
            newPath = path.replace(/^\/get-/g, '/');
            newPath = path.replace(/^\/query-/g, '/');
            break;
          }
          case 'mutation': {
            newPath = path.replace(/^\/create-/g, '/');
            newPath = path.replace(/^\/delete-/g, '/');
            newPath = path.replace(/^\/mutation-/g, '/');
            newPath = path.replace(/^\/update-/g, '/');
            break;
          }
        }
        return newPath;
      },
      errorHandler: sofaErrorHandler,
    } as SofaConfig),
};
