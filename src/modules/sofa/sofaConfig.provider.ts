/**
 * File: /src/modules/sofa/sofaConfig.provider.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 18-07-2021 03:30:25
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

import { ErrorHandler } from '@codejamninja/sofa-api/express';
import { FactoryProvider } from '@nestjs/common';
import { OperationDefinitionNode, GraphQLSchema } from 'graphql';
import { SofaConfig } from '@codejamninja/sofa-api/sofa';
import { Kind, Method } from '@codejamninja/sofa-api/types';
import { SOFA_ERROR_HANDLER } from './sofaErrorHandler.provider';
import { SOFA_GRAPHQL_SCHEMA } from './types';

export const SOFA_CONFIG = 'SOFA_CONFIG';

const SofaConfigProvider: FactoryProvider<Promise<SofaConfig>> = {
  provide: SOFA_CONFIG,
  inject: [SOFA_ERROR_HANDLER, SOFA_GRAPHQL_SCHEMA],
  useFactory: async (sofaErrorHandler: ErrorHandler, schema: GraphQLSchema) =>
    ({
      schema,
      basePath: '/api',
      method: {},
      name: {},
      calculateMethod(
        method: Method,
        kind: Kind,
        { name }: OperationDefinitionNode
      ) {
        switch (kind) {
          case 'query': {
            return 'GET';
            break;
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
      calculatePath(
        path: string,
        kind: Kind,
        _operationDefinitionNode: OperationDefinitionNode
      ) {
        switch (kind) {
          case 'query': {
            path = path.replace(/^\/find-/g, '/');
            path = path.replace(/^\/get-/g, '/');
            path = path.replace(/^\/query-/g, '/');
            break;
          }
          case 'mutation': {
            path = path.replace(/^\/create-/g, '/');
            path = path.replace(/^\/delete-/g, '/');
            path = path.replace(/^\/mutation-/g, '/');
            path = path.replace(/^\/update-/g, '/');
            break;
          }
        }
        return path;
      },
      errorHandler: sofaErrorHandler
    } as SofaConfig)
};

export default SofaConfigProvider;
