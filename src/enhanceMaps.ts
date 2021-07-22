/**
 * File: /src/enhanceMaps.ts
 * Project: example-nestjs
 * File Created: 22-07-2021 05:00:22
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-07-2021 05:22:37
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

import { CacheScope } from 'apollo-server-types';
import { Authorized } from 'nestjs-keycloak';
import {
  applyModelsEnhanceMap,
  applyResolversEnhanceMap
} from '~/generated/type-graphql';
import { CacheControl } from '~/modules/typegraphql';

applyModelsEnhanceMap({
  User: {
    fields: {
      _all: [CacheControl({ maxAge: 60, scope: CacheScope.Private })]
    }
  }
});

applyResolversEnhanceMap({
  User: {
    _all: [
      CacheControl({ maxAge: 60, scope: CacheScope.Private }),
      Authorized()
    ]
  }
});
