import { ValidationPipe } from '@nestjs/common';
import { Adapter } from './types';
import {
  createApp,
  appListen,
  registerEjs,
  registerSofa,
  registerSwagger
} from '~/bootstrap';

const adapter = Adapter.Express;

(async () => {
  const app = await createApp(adapter);
  await registerEjs(app, adapter);
  app.useGlobalPipes(new ValidationPipe());
  registerSwagger(app);
  await appListen(app, adapter);
  registerSofa(app);
})();
