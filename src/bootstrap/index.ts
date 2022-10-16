/**
 * File: /src/bootstrap/index.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-10-2022 06:52:17
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

import path from 'path';
import dotenv from 'dotenv';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  appListen,
  createApp,
  registerEjs,
  registerLogger,
  registerMiscellaneous,
  registerSofa,
  registerSwagger,
} from 'app/bootstrap';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let bootstrappedEvents: BootstrapEvent[] = [];
let app: NestExpressApplication;

export async function start() {
  app = await createApp();
  registerLogger(app);
  await app.init();
  const { schema } = app.get(GraphQLSchemaHost);
  app.close();
  app = await createApp();
  registerLogger(app);
  const sofa = await registerSofa(app, schema);
  await registerEjs(app);
  registerSwagger(app, sofa);
  await registerMiscellaneous(app);
  const p = appListen(app);
  await emitBootstrapped(app);
  await p;
}

export async function stop() {
  if (!app) return;
  await app.close();
}

export async function restart() {
  await stop();
  await start();
}

export function onBootstrapped(cb: (...args: any[]) => any) {
  bootstrappedEvents.push(cb);
}

async function emitBootstrapped(app: NestExpressApplication) {
  const clonedBootstrappedEvents = [...bootstrappedEvents];
  bootstrappedEvents = [];
  await new Promise((r) => setTimeout(r, 1000, null));
  clonedBootstrappedEvents.forEach((event: BootstrapEvent) => event(app));
}

export * from './app';
export * from './ejs';
export * from './logger';
export * from './sofa';
export * from './swagger';
export * from './miscellaneous';

export type BootstrapEvent = (app: NestExpressApplication) => any;
