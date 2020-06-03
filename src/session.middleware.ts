import { AsyncOptions, createModule, SyncOptions } from './createMiddleware';
import passport from 'passport';
import expressSession from 'express-session';
import { createRetriesMiddleware } from './middleware/retries.middleware';

interface Options {
  session: expressSession.SessionOptions;
  retries?: number;
  retriesStrategy?: Parameters<typeof createRetriesMiddleware>[2];
}

export type NestSessionOptions = SyncOptions<Options>;
export type NestSessionAsyncOptions = AsyncOptions<Options>;

export const SessionModule = createModule<Options>((options) => {
  const { retries, session, retriesStrategy } = options;
  let middleware = expressSession(session);
  if (retries !== undefined) {
    middleware = createRetriesMiddleware(middleware, retries, retriesStrategy);
  }
  return [
    passport.initialize(),
    passport.session(),
    middleware,
    (req: any, _res: any, next: any) => {
      console.log('session', req.session);
      next();
    }
  ];
});
