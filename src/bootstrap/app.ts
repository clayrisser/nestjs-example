/**
 * File: /src/bootstrap/app.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 05-05-2022 08:18:09
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

import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import getPort from "get-port";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger, LogLevel } from "@nestjs/common";
import { AppModule } from "~/app";

const logger = new Logger("Bootstrap");
let port: number | null = null;
const { env } = process;

export async function createApp(): Promise<NestExpressApplication> {
  let logLevels = (env.LOG_LEVELS || "").split(",") as LogLevel[];
  if (!logLevels.length || !!Number(env.DEBUG)) {
    logLevels = ["error", "warn", "log", "debug", "verbose"];
  }
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { bodyParser: true, logger: logLevels }
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  if (configService.get("CORS") === "1") app.enableCors();
  return app;
}

export async function appListen(app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  if (!port) {
    port = await getPort({
      port: Number(configService.get("PORT") || 3000),
    });
  }
  const expressApp = app as NestExpressApplication;
  await expressApp
    .listen(port, "0.0.0.0", () => {
      logger.log(`listening on port ${port}`);
    })
    .catch(logger.error);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

declare const module: any;
