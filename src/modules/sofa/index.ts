import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import SofaApolloServerProvider from './sofaApolloServerProvider';
import SofaConfigProvider from './sofaConfigProvider';
import SofaErrorHandlerProvider from './sofaErrorHandlerProvider';
import SofaExecuteProvider from './sofaExecuteProvider';
import SofaMiddleware from './sofaMiddleware';
import SofaOpenApiProvider from './sofaOpenApiProvider';
import SofaSwaggerMiddleware from './sofaSwaggerMiddleware';

@Module({
  exports: [
    SofaApolloServerProvider,
    SofaConfigProvider,
    SofaErrorHandlerProvider,
    SofaExecuteProvider,
    SofaOpenApiProvider
  ],
  imports: [GraphbackModule],
  providers: [
    SofaApolloServerProvider,
    SofaConfigProvider,
    SofaErrorHandlerProvider,
    SofaExecuteProvider,
    SofaOpenApiProvider
  ]
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
  SofaApolloServerProvider,
  SofaConfigProvider,
  SofaErrorHandlerProvider,
  SofaMiddleware,
  SofaOpenApiProvider,
  SofaSwaggerMiddleware
};

export * from './sofaApolloServerProvider';
export * from './sofaConfigProvider';
export * from './sofaErrorHandlerProvider';
export * from './sofaExecuteProvider';
export * from './sofaOpenApiProvider';
