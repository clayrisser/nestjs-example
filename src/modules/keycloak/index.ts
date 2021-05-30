import { Module } from '@nestjs/common';
import KeycloakConfigProvider from './keycloakConfig.provider';
import KeycloakCrudServiceProvider from './keycloakCrudService.provider';
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
export default class KeycloakModule {}

export * from './keycloak.provider';
export * from './keycloakConfig.provider';
export * from './keycloakCrudService.provider';
export {
  KeycloakConfigProvider,
  KeycloakCrudServiceProvider,
  KeycloakProvider
};
