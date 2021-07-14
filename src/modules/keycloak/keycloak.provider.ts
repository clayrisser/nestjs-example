/**
 * File: /src/modules/keycloak/keycloak.provider.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:36:00
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

import KeycloakConnect, { Keycloak } from 'keycloak-connect';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const KEYCLOAK = 'KEYCLOAK';

const KeycloakProvider: FactoryProvider<Keycloak> = {
  provide: KEYCLOAK,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const clientSecret = config.get('KEYCLOAK_CLIENT_SECRET');
    return new KeycloakConnect({ store: new session.MemoryStore() }, {
      bearerOnly: true,
      clientId: config.get('KEYCLOAK_CLIENT_ID'),
      realm: config.get('KEYCLOAK_REALM') || '',
      serverUrl: `${config.get('KEYCLOAK_BASE_URL')}/auth`,
      credentials: {
        ...(clientSecret ? { secret: clientSecret } : {})
      }
    } as unknown as any);
  }
};

export default KeycloakProvider;
