import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { createCRUDService } from 'graphback';
import { createKeycloakCRUDService } from '@graphback/keycloak-authz';
import { KEYCLOAK_CONFIG, KeycloakConfig } from './keycloakConfig.provider';

export const KEYCLOAK_CRUD_SERVICE = 'KEYCLOAK_CRUD_SERVICE';

const KeycloakCrudServiceProvider: FactoryProvider<Promise<any>> = {
  provide: KEYCLOAK_CRUD_SERVICE,
  inject: [ConfigService, KEYCLOAK_CONFIG],
  useFactory: async (
    _config: ConfigService,
    keycloakConfig: KeycloakConfig
  ) => {
    return createKeycloakCRUDService(
      keycloakConfig,
      createCRUDService({
        pubSub: new PubSub()
      })
    );
  }
};

export default KeycloakCrudServiceProvider;
