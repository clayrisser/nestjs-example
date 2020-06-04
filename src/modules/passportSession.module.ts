import passport from 'passport';
import {
  DynamicModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';

export class PassportSessionModule {
  static register(): DynamicModule {
    return {
      module: PassportSessionModule
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(passport.initialize(), passport.session())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
