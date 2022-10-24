/**
 * File: /src/modules/core/typegraphql/index.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 24-10-2022 08:55:15
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

import ResponseCachePlugin from 'apollo-server-plugin-response-cache';
import { ApolloDriver } from '@nestjs/apollo';
import { BaseRedisCache, RedisClient } from 'apollo-server-cache-redis';
import { ConfigService } from '@nestjs/config';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { GraphQLRequestContext } from 'apollo-server-types';
import { GraphqlCtx } from 'app/types';
import { MIDDLEWARES, WRAP_CONTEXT } from '@risserlabs/nestjs-keycloak-typegraphql';
import { MiddlewareFn } from 'type-graphql';
import { PrismaService } from 'app/modules/core/prisma';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { TypeGraphQLModule } from '@risserlabs/typegraphql-nestjs';

export function createTypeGraphqlModule(
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): DynamicModule {
  return TypeGraphQLModule.forRootAsync({
    driver: ApolloDriver,
    imports: [...imports],
    inject: [RedisService, ConfigService, PrismaService, MIDDLEWARES, WRAP_CONTEXT],
    useFactory: (
      redisService: RedisService,
      configService: ConfigService,
      prismaService: PrismaService,
      middlewares: MiddlewareFn[],
      wrapContext: (context: Record<string, unknown>) => GraphqlCtx,
    ): any => {
      return {
        cors: configService.get('CORS') === '1',
        debug: configService.get('DEBUG') === '1',
        context: (context: Record<string, unknown>) => {
          const { req } = context;
          return wrapContext({
            req,
            prisma: prismaService,
          });
        },
        dateScalarMode: 'timestamp',
        emitSchemaFile: false,
        tracing: true,
        validate: true,
        playground: configService.get('GRAPHQL_PLAYGROUND') === '1' || configService.get('DEBUG') === '1',
        globalMiddlewares: [...middlewares],
        ...(Number(configService.get('ENABLE_CACHING'))
          ? {
              cacheControl: {
                defaultMaxAge: Number(configService.get('DEFAULT_MAX_AGE') || 60),
              },
            }
          : {}),
        cache: new BaseRedisCache({
          client: redisService.getClient() as RedisClient,
        }),
        persistedQueries: {
          cache: new BaseRedisCache({
            client: redisService.getClient() as RedisClient,
          }),
        },
        plugins: [
          ...(Number(configService.get('ENABLE_CACHING'))
            ? [
                ResponseCachePlugin({
                  sessionId: async ({ context }: GraphQLRequestContext<Record<string, any>>) => {
                    return context.keycloakService?.getUserId();
                  },
                }),
              ]
            : []),
        ],
      };
    },
  });
}

export * from './cacheControl.decorator';
