/**
 * File: /src/modules/typegraphql/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 15-07-2021 19:29:46
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

// import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ConfigService } from '@nestjs/config';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { KEYCLOAK } from 'nestjs-keycloak';
import { Keycloak } from 'keycloak-connect';
import { KeycloakContext, GrantedRequest } from 'keycloak-connect-graphql';
import { Redis } from 'ioredis';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import { HashMap } from '~/types';
import { REDIS_CLIENT } from '~/modules/redis';

export function createTypeGraphqlModule(
  imports: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  > = []
): DynamicModule {
  return TypeGraphQLModule.forRootAsync({
    imports: [...imports],
    inject: [ConfigService, KEYCLOAK, REDIS_CLIENT],
    useFactory: (
      configService: ConfigService,
      keycloak: Keycloak,
      _redisClient: Redis
    ) => {
      return {
        cors: configService.get('CORS') === '1',
        debug: configService.get('DEBUG') === '1',
        context: (context: HashMap & { req: GrantedRequest }) => {
          const { req } = context;
          const kauth = new KeycloakContext({ req: context.req }, keycloak);
          return {
            kauth,
            req
          };
        },
        emitSchemaFile: false,
        validate: false,
        dateScalarMode: 'timestamp',
        persistedQueries: {
          // cache: new BaseRedisCache({
          //   client: redisClient
          // })
        },
        plugins: [
          ...(configService.get('GRAPHQL_PLAYGROUND') === '1' ||
          configService.get('DEBUG') === '1'
            ? [
                ApolloServerPluginLandingPageGraphQLPlayground({
                  settings: {
                    'request.credentials': 'include'
                  }
                })
              ]
            : [])
        ]
      };
    }
  });
}