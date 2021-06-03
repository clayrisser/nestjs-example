import KeycloakConnect, { Keycloak } from 'keycloak-connect';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const KEYCLOAK = 'KEYCLOAK';

const KeycloakProvider: FactoryProvider<Keycloak> = {
  provide: KEYCLOAK,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new KeycloakConnect({ store: new session.MemoryStore() }, {
      bearerOnly: true,
      clientId: config.get('KEYCLOAK_CLIENT_ID'),
      realm: config.get('KEYCLOAK_REALM') || '',
      realmPublicKey: config.get('KEYCLOAK_REALM_PUBLIC_KEY'),
      serverUrl: `${config.get('KEYCLOAK_BASE_URL')}/auth`
    } as unknown as any);
  }
};

export default KeycloakProvider;
