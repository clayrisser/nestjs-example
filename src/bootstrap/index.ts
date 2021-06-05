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
  await new Promise((r) => setTimeout(r, 1000));
  clonedBootstrappedEvents.forEach((event: BootstrapEvent) => event(app));
}

export * from './app';
export * from './ejs';
export * from './sofa';
export * from './swagger';

export type BootstrapEvent = (
  app: NestExpressApplication | NestFastifyApplication
) => any;
