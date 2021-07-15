/**
 * File: /src/bootstrap/index.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 19:14:51
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

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Adapter } from '~/types';
import {
  appListen,
  createApp,
  registerEjs,
  registerSofa,
  registerSwagger
} from '~/bootstrap';

const adapter = Adapter.Express;
let bootstrappedEvents: BootstrapEvent[] = [];
let app: NestExpressApplication | NestFastifyApplication;

export async function start() {
  app = await createApp(adapter);
  await registerEjs(app);
  registerSwagger(app);
  registerSofa(app);
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

async function emitBootstrapped(
  app: NestExpressApplication | NestFastifyApplication
) {
  const clonedBootstrappedEvents = [...bootstrappedEvents];
  bootstrappedEvents = [];
  await new Promise((r) => setTimeout(r, 1000, null));
  clonedBootstrappedEvents.forEach((event: BootstrapEvent) => event(app));
}

export * from './app';
export * from './ejs';
export * from './sofa';
export * from './swagger';

export type BootstrapEvent = (
  app: NestExpressApplication | NestFastifyApplication
) => any;
