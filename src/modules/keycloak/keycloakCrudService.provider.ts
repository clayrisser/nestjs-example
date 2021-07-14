/**
 * File: /src/modules/keycloak/keycloakCrudService.provider.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:36:06
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

import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { createCRUDService } from 'graphback';
import { createKeycloakCRUDService } from '@graphback/keycloak-authz';
import { KEYCLOAK_CONFIG, KeycloakConfig } from './keycloakConfig.provider';

export const KEYCLOAK_CRUD_SERVICE = 'KEYCLOAK_CRUD_SERVICE';

const KeycloakCrudServiceProvider: FactoryProvider<Promise<any>> = {
  provide: KEYCLOAK_CRUD_SERVICE,
  inject: [ConfigService, KEYCLOAK_CONFIG],
  useFactory: async (
    _config: ConfigService,
    keycloakConfig: KeycloakConfig
  ) => {
    return createKeycloakCRUDService(
      keycloakConfig,
      createCRUDService({
        pubSub: new PubSub()
      })
    );
  }
};

export default KeycloakCrudServiceProvider;
