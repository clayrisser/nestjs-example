/**
 * File: /src/app.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 24-07-2021 01:11:54
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

// import { RedisModule } from 'nestjs-redis';
import KeycloakModule from 'nestjs-keycloak';
import KeycloakTypegraphql from 'nestjs-keycloak-typegraphql';
import path from 'path';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { AxiosLoggerModule } from 'nestjs-axios-logger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { BatchSpanProcessor } from '@opentelemetry/tracing';
import { CompositePropagator } from '@opentelemetry/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { HttpModule } from '@nestjs/axios';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Module, Global } from '@nestjs/common';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import PrismaModule from '~/modules/prisma';
import RedisModule from '~/modules/redis';
import modules from '~/modules';
import { VoidController } from '~/modules/openTelemetry';
import { createTypeGraphqlModule } from '~/modules/typegraphql';
import {
  UserCrudResolver,
  ConfigurationCrudResolver
} from '~/generated/type-graphql/resolvers/crud';

const { env } = process;
const rootPath = path.resolve(__dirname, '..');

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      controller: VoidController
    }),
    OpenTelemetryModule.register({
      spanProcessor: new BatchSpanProcessor(
        new JaegerExporter({
          tags: [{ key: 'howdy', value: 'texas' }],
          host: env.JAEGER_HOST || 'localhost',
          password: env.JAEGER_PASSWORD,
          port: Number(env.JAEGER_HOST || 6831),
          username: env.JAEGER_USERNAME
        })
      ) as any,
      contextManager: new AsyncLocalStorageContextManager() as any,
      textMapPropagator: new CompositePropagator({
        propagators: [
          new B3Propagator(),
          new B3Propagator({
            injectEncoding: B3InjectEncoding.MULTI_HEADER
          })
        ]
      }),
      instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation()
      ]
    }),
    AxiosLoggerModule.register({
      data: false,
      headers: false,
      requestLogLevel: 'log',
      responseLogLevel: 'log'
    }),
    ConfigModule.forRoot({
      envFilePath: path.resolve(rootPath, '.env')
    }),
    createTypeGraphqlModule(),
    KeycloakModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          adminClientId: config.get('KEYCLOAK_ADMIN_CLIENT_ID') || '',
          adminPassword: config.get('KEYCLOAK_ADMIN_PASSWORD') || '',
          adminUsername: config.get('KEYCLOAK_ADMIN_USERNAME') || '',
          baseUrl: config.get('KEYCLOAK_BASE_URL') || '',
          clientId: config.get('KEYCLOAK_CLIENT_ID') || '',
          clientSecret: config.get('KEYCLOAK_CLIENT_SECRET') || '',
          realm: config.get('KEYCLOAK_REALM') || '',
          register: {
            resources: {},
            roles: []
          }
        };
      }
    }),
    // RedisModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory(config: ConfigService) {
    //     return {
    //       url: `redis://:${config.get('REDIS_PASSWORD')}@${config.get(
    //         'REDIS_HOST'
    //       )}:${config.get('REDIS_PORT')}/${config.get('REDIS_DATABASE')}`
    //     };
    //   }
    // }),
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
  providers: [ConfigService, UserCrudResolver, ConfigurationCrudResolver],
  exports: [ConfigService]
})
export class AppModule {}
