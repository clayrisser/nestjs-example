import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import SofaMiddleware from './middleware';

@Module({
  imports: [GraphbackModule]
})
export default class SofaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SofaMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

export * from './middleware';
export { SofaMiddleware };
