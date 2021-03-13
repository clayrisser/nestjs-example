import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import SofaMiddleware from './sofaMiddleware';
import SwaggerMiddleware from './swaggerMiddleware';
import OpenApiProvider from './openApiProvider';
import SofaConfigProvider from './sofaConfigProvider';

@Module({
  exports: [OpenApiProvider, SofaConfigProvider],
  imports: [GraphbackModule],
  providers: [OpenApiProvider, SofaConfigProvider]
})
export default class SofaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SwaggerMiddleware)
      .forRoutes({ path: '/api/docs', method: RequestMethod.ALL });
    consumer
      .apply(SofaMiddleware)
      .forRoutes({ path: '/api', method: RequestMethod.ALL });
  }
}

export {
  OpenApiProvider,
  SofaConfigProvider,
  SofaMiddleware,
  SwaggerMiddleware
};

export * from './openApiProvider';
export * from './sofaConfigProvider';
