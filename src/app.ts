/**
 * File: /src/app.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 18-07-2021 02:21:01
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

import KeycloakModule, { AuthGuard, ResourceGuard } from 'nestjs-keycloak';
import KeycloakTypegraphql from 'nestjs-keycloak-typegraphql';
import path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AxiosLoggerModule } from 'nestjs-axios-logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import PrismaModule from '~/modules/prisma';
import RedisModule from '~/modules/redis';
import modules from '~/modules';
import { createTypeGraphqlModule } from '~/modules/typegraphql';
import {
  UserCrudResolver,
  ConfigurationCrudResolver
} from '~/generated/type-graphql/resolvers/crud';

const rootPath = path.resolve(__dirname, '..');

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(rootPath, '.env')
    }),
    createTypeGraphqlModule(),
    KeycloakModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseUrl: config.get('KEYCLOAK_BASE_URL') || '',
        clientId: config.get('KEYCLOAK_CLIENT_ID') || '',
        clientSecret: config.get('KEYCLOAK_CLIENT_SECRET'),
        realm: config.get('KEYCLOAK_REALM') || ''
      })
    }),
    KeycloakTypegraphql.register({}),
    PrismaModule,
    AxiosLoggerModule.register({
      data: false,
      headers: false,
      requestLogLevel: 'log',
      responseLogLevel: 'log'
    }),
    RedisModule,
    HttpModule.register({}),
    ...modules
  ],
  providers: [
    ConfigService,
    UserCrudResolver,
    ConfigurationCrudResolver,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard
    }
  ],
  exports: [ConfigService]
})
export class AppModule {}
