/**
 * File: /src/app.module.ts
 * Project: app
 * File Created: 22-10-2022 06:38:15
 * Author: Clay Risser
 * -----
 * Last Modified: 23-10-2022 04:36:29
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

// import { RedisModule } from 'app/modules/redis';
// import { RedisModule } from 'nestjs-redis';
import KeycloakModule from '@risserlabs/nestjs-keycloak';
import KeycloakTypegraphql from '@risserlabs/nestjs-keycloak-typegraphql';
import modules from 'app/modules';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { PrismaModule } from 'app/modules/core/prisma';
import { createTypeGraphqlModule } from 'app/modules/core/typegraphql';
import { AxiosLoggerModule } from 'nestjs-axios-logger';

@Global()
@Module({
  imports: [
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: {
          enable: true,
          ignoreRoutes: ['/favicon.ico'],
          ignoreUndefinedRoutes: false,
        },
      },
    }),
    AxiosLoggerModule.register({
      data: false,
      headers: false,
      requestLogLevel: 'log',
      responseLogLevel: 'log',
    }),
    ConfigModule.forRoot({
      envFilePath: path.resolve(process.cwd(), '.env'),
    }),
    createTypeGraphqlModule(),
    KeycloakModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        adminClientId: config.get('KEYCLOAK_ADMIN_CLIENT_ID') || '',
        adminPassword: config.get('KEYCLOAK_ADMIN_PASSWORD') || '',
        adminUsername: config.get('KEYCLOAK_ADMIN_USERNAME') || '',
        baseUrl: config.get('KEYCLOAK_BASE_URL') || '',
        clientId: config.get('KEYCLOAK_CLIENT_ID') || '',
        clientSecret: config.get('KEYCLOAK_CLIENT_SECRET') || '',
        realm: config.get('KEYCLOAK_REALM') || '',
        register: {
          resources: {},
          roles: [],
        },
      }),
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
    // RedisModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ...modules,
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    ConfigService,
  ],
  exports: [ConfigService],
})
export class AppModule {}
