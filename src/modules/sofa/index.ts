import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import SofaMiddleware from './sofaMiddleware';
import SofaConfigProvider from './sofaConfigProvider';
import SofaOpenApiProvider from './sofaOpenApiProvider';
import SofaSwaggerMiddleware from './sofaSwaggerMiddleware';

@Module({
  exports: [SofaOpenApiProvider, SofaConfigProvider],
  imports: [GraphbackModule],
  providers: [SofaOpenApiProvider, SofaConfigProvider]
})
export default class SofaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(SofaSwaggerMiddleware)
    //   .forRoutes({ path: '/api/docs', method: RequestMethod.ALL });
    consumer
      .apply(SofaMiddleware)
      .forRoutes({ path: '/api', method: RequestMethod.ALL });
  }
}

export {
  SofaConfigProvider,
  SofaMiddleware,
  SofaOpenApiProvider,
  SofaSwaggerMiddleware
};

export * from './sofaOpenApiProvider';
export * from './sofaConfigProvider';
