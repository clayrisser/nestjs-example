import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const KEYCLOAK_CONFIG = 'KEYCLOAK_CONFIG';

const KeycloakConfigProvider: FactoryProvider<KeycloakConfig> = {
  provide: KEYCLOAK_CONFIG,
  inject: [ConfigService],
  useFactory: async (_config: ConfigService) => {
    return {
      Note: {
        create: { roles: ['admin'] },
        delete: { roles: ['admin'] },
        read: { roles: ['admin'] },
        update: { roles: ['admin'] }
      }
    };
  }
};

export default KeycloakConfigProvider;

export interface KeycloakConfig {
  [key: string]: any;
}
