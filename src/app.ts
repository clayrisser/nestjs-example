/**
 * File: /src/app.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 17-07-2021 21:34:21
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
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalLogConfig } from 'axios-logger/lib/common/types';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { errorLogger, requestLogger, responseLogger } from 'axios-logger';
import PrismaModule from '~/modules/prisma';
import RedisModule from '~/modules/redis';
import modules from '~/modules';
import { createTypeGraphqlModule } from '~/modules/typegraphql';
import HideSecrets from '~/hideSecrets';
import {
  UserCrudResolver,
  ConfigurationCrudResolver
} from '~/generated/type-graphql/resolvers/crud';

const rootPath = path.resolve(__dirname, '..');
let setAxiosInterceptors = false;

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
    RedisModule,
    HttpModule.register({}),
    ...modules
  ],
  providers: [
    ConfigService,
    UserCrudResolver,
    ConfigurationCrudResolver
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard
    // }
  ],
  exports: [ConfigService]
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    const hideSecrets = new HideSecrets({
      enabled:
        !!Number(this.configService.get('DEBUG')) ||
        !!Number(this.configService.get('HIDE_SECRETS'))
    });
    if (!setAxiosInterceptors) {
      const logger = new Logger(HttpService.name);
      const config: GlobalLogConfig = {
        data: true,
        dateFormat: false,
        headers: true,
        method: true,
        prefixText: false,
        status: true,
        url: true
      };
      const logConfig: GlobalLogConfig = {
        ...config,
        logger: (message: string) => logger.verbose(hideSecrets.filter(message))
      };
      const errorConfig: GlobalLogConfig = {
        ...config,
        logger: (message: string) => logger.error(hideSecrets.filter(message))
      };
      axios.interceptors.request.use(
        (request: AxiosRequestConfig) => requestLogger(request, logConfig),
        (error: AxiosError<any>) => errorLogger(error, errorConfig)
      );
      axios.interceptors.response.use(
        (response: AxiosResponse) => responseLogger(response, logConfig),
        (error: AxiosError<any>) => errorLogger(error, errorConfig)
      );
      setAxiosInterceptors = true;
    }
  }
}
