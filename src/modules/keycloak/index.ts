import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import KeycloakConfigProvider from './keycloakConfig.provider';
import KeycloakCrudServiceProvider from './keycloakCrudService.provider';
import KeycloakMiddleware from './keycloak.middleware';
import KeycloakProvider from './keycloak.provider';

@Module({
  providers: [
    KeycloakConfigProvider,
    KeycloakCrudServiceProvider,
    KeycloakProvider
  ],
  exports: [
    KeycloakConfigProvider,
    KeycloakCrudServiceProvider,
    KeycloakProvider
  ]
})
export default class KeycloakModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KeycloakMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

export * from './keycloak.provider';
export * from './keycloakConfig.provider';
export * from './keycloakCrudService.provider';
export {
  KeycloakConfigProvider,
  KeycloakCrudServiceProvider,
  KeycloakMiddleware,
  KeycloakProvider
};
