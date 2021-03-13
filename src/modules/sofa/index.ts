import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import SofaConfigProvider from './sofaConfig.provider';
import SofaErrorHandlerProvider from './sofaErrorHandler.provider';
import SofaMiddleware from './sofa.middleware';
import SofaOpenApiProvider from './sofaOpenApi.provider';
import SofaSwaggerMiddleware from './sofaSwagger.middleware';

@Module({
  exports: [SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider],
  imports: [GraphbackModule],
  providers: [SofaConfigProvider, SofaErrorHandlerProvider, SofaOpenApiProvider]
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
  SofaErrorHandlerProvider,
  SofaMiddleware,
  SofaOpenApiProvider,
  SofaSwaggerMiddleware
};

export * from './sofaConfig.provider';
export * from './sofaErrorHandler.provider';
export * from './sofaOpenApi.provider';
