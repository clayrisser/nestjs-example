/**
 * File: /src/app.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 15-07-2021 19:29:01
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

import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import KeycloakModule from 'nestjs-keycloak';
import PrismaModule from '~/modules/prisma';
import RedisModule from '~/modules/redis';
import modules from '~/modules';
import { createTypeGraphqlModule } from '~/modules/typegraphql';
import {
  UserCrudResolver,
  ConfigurationCrudResolver
} from '~/generated/type-graphql/resolvers/crud';

const rootPath = path.resolve(__dirname, '..');

const imports = [
  KeycloakModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      baseUrl: config.get('KEYCLOAK_BASE_URL') || '',
      clientId: config.get('KEYCLOAK_CLIENT_ID') || '',
      realm: config.get('KEYCLOAK_REALM') || ''
    })
  }),
  PrismaModule,
  RedisModule
];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(rootPath, '.env')
    }),
    createTypeGraphqlModule(imports),
    ...imports,
    ...modules
  ],
  providers: [ConfigService, UserCrudResolver, ConfigurationCrudResolver],
  exports: [ConfigService]
})
export class AppModule {}
