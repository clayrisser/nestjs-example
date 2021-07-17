/**
 * File: /src/modules/sofa/types.ts
 * Project: example-nestjs
 * File Created: 15-07-2021 01:34:31
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-07-2021 20:54:09
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

import { RouteInfo } from '@codejamninja/sofa-api/types';
import { OpenAPIObject } from '@nestjs/swagger';

export const SOFA_GRAPHQL_SCHEMA = 'SOFA_GRAPHQL_SCHEMA';

export interface SofaOpenApi {
  addRoute(
    info: RouteInfo,
    config?:
      | {
          basePath?: string | undefined;
        }
      | undefined
  ): void;
  get(): OpenAPIObject;
  save(filepath: string): void;
}
