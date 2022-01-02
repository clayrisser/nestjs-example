/**
 * File: /src/app.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 02-01-2022 11:28:46
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
import KeycloakModule from "nestjs-keycloak";
import KeycloakTypegraphql from "nestjs-keycloak-typegraphql";
import path from "path";
import { AxiosLoggerModule } from "nestjs-axios-logger";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HasuraModule, HasuraModuleConfig } from "@golevelup/nestjs-hasura";
import { HttpModule } from "@nestjs/axios";
import { Module, Global } from "@nestjs/common";
import PrismaModule from "~/modules/prisma";
import RedisModule from "~/modules/redis";
import modules from "~/modules";
import resolvers from "~/resolvers";
import { createTypeGraphqlModule } from "~/modules/typegraphql";

const rootPath = path.resolve(__dirname, "..");

@Global()
@Module({
  imports: [
    AxiosLoggerModule.register({
      data: false,
      headers: false,
      requestLogLevel: "log",
      responseLogLevel: "log",
    }),
    ConfigModule.forRoot({
      envFilePath: path.resolve(rootPath, ".env"),
    }),
    createTypeGraphqlModule(),
    KeycloakModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        adminClientId: config.get("KEYCLOAK_ADMIN_CLIENT_ID") || "",
        adminPassword: config.get("KEYCLOAK_ADMIN_PASSWORD") || "",
        adminUsername: config.get("KEYCLOAK_ADMIN_USERNAME") || "",
        baseUrl: config.get("KEYCLOAK_BASE_URL") || "",
        clientId: config.get("KEYCLOAK_CLIENT_ID") || "",
        clientSecret: config.get("KEYCLOAK_CLIENT_SECRET") || "",
        realm: config.get("KEYCLOAK_REALM") || "",
        register: {
          resources: {},
          roles: [],
        },
      }),
    }),
    HasuraModule.forRootAsync(HasuraModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        webhookConfig: {
          secretFactory:
            configService.get<string>("NESTJS_EVENT_WEBHOOK_SHARED_SECRET") ||
            "",
          secretHeader: "nestjs-event-webhook",
        },
        managedMetaDataConfig: {
          metadataVersion: "v3",
          dirPath: path.join(process.cwd(), "hasura/metadata"),
          nestEndpointEnvName: "NESTJS_EVENT_WEBHOOK_ENDPOINT",
          secretHeaderEnvName: "NESTJS_EVENT_WEBHOOK_SHARED_SECRET",
          defaultEventRetryConfig: {
            numRetries: 3,
            timeoutInSeconds: 100,
            intervalInSeconds: 30,
            toleranceSeconds: 21600,
          },
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
    RedisModule,
    HttpModule.register({}),
    ...modules,
  ],
  providers: [ConfigService, ...resolvers],
  exports: [ConfigService],
})
export class AppModule {}
