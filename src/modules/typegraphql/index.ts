/**
 * File: /src/modules/typegraphql/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-07-2021 00:49:03
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

// import { RedisService } from 'nestjs-redis';
import ResponseCachePlugin from 'apollo-server-plugin-response-cache';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ConfigService } from '@nestjs/config';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { MIDDLEWARES, WRAP_CONTEXT } from 'nestjs-keycloak-typegraphql';
import { MiddlewareFn } from 'type-graphql';
import { Redis } from 'ioredis';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginCacheControl
} from 'apollo-server-core';
import { GraphqlCtx, HashMap } from '~/types';
import { PrismaService } from '~/modules/prisma';
import { REDIS_CLIENT } from '~/modules/redis';

export function createTypeGraphqlModule(
  imports: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  > = []
): DynamicModule {
  return TypeGraphQLModule.forRootAsync({
    imports: [...imports],
    inject: [
      // RedisService,
      ConfigService,
      PrismaService,
      REDIS_CLIENT,
      MIDDLEWARES,
      WRAP_CONTEXT
    ],
    useFactory: (
      // redisService: RedisService,
      configService: ConfigService,
      prismaService: PrismaService,
      redisClient: Redis,
      middlewares: MiddlewareFn[],
      wrapContext: (context: HashMap) => GraphqlCtx
    ) => {
      return {
        cors: configService.get('CORS') === '1',
        debug: configService.get('DEBUG') === '1',
        context: (context: HashMap) => {
          const { req } = context;
          return wrapContext({
            req,
            prisma: prismaService
          });
        },
        dateScalarMode: 'timestamp',
        emitSchemaFile: false,
        validate: false,
        globalMiddlewares: [...middlewares],
        cacheControl: {
          defaultMaxAge: 60
        },
        cache: new BaseRedisCache({
          client: redisClient
          // client: redisService.getClient()
        }),
        persistedQueries: {
          cache: new BaseRedisCache({
            client: redisClient
            // client: redisService.getClient()
          })
        },
        plugins: [
          ResponseCachePlugin(),
          ApolloServerPluginCacheControl({
            defaultMaxAge: 240,
            calculateHttpHeaders: true
          }),
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

export * from './cacheControl.decorator';
