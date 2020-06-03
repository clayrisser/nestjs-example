import passport from 'passport';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { SessionOptions } from 'express-session';
import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Provider,
  RequestMethod
} from '@nestjs/common';
import { SessionMiddleware } from './middleware/session.middleware';

const DEFAULT_ROUTES = [{ path: '*', method: RequestMethod.ALL }];
export const PASSPORT_SESSION_OPTIONS = 'PASSPORT_SESSION_OPTIONS';

@Global()
export class PassportSessionModule {
  static forRoot(options: PassportSessionOptions): DynamicModule {
    return {
      module: PassportSessionModule,
      providers: [
        {
          provide: PASSPORT_SESSION_OPTIONS,
          useValue: options
        }
      ],
      exports: [PASSPORT_SESSION_OPTIONS]
    };
  }

  static async forRootAsync(
    options: PassportSessionModuleAsyncOptions
  ): Promise<DynamicModule> {
    return {
      imports: options.imports || [],
      module: PassportSessionModule,
      providers: [this.createPassportSessionOptionsProvider(options)],
      exports: [PASSPORT_SESSION_OPTIONS]
    };
  }

  private static createPassportSessionOptionsProvider(
    options: PassportSessionModuleAsyncOptions
  ): Provider {
    return {
      inject: options.inject || [],
      provide: PASSPORT_SESSION_OPTIONS,
      useFactory: options.useFactory
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // SessionMiddleware,
        passport.initialize(),
        passport.session(),
        (req: any, _res: any, next: any) => {
          console.log('session', req.session);
          next();
        }
      )
      .forRoutes(...DEFAULT_ROUTES);
  }
}

export interface PassportSessionModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<PassportSessionOptions> | PassportSessionOptions;
}

export interface PassportSessionOptions {
  session: SessionOptions;
}
