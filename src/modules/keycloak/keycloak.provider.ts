import KeycloakConnect, { Keycloak } from 'keycloak-connect';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const KEYCLOAK = 'KEYCLOAK';

const KeycloakProvider: FactoryProvider<Keycloak> = {
  provide: KEYCLOAK,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const clientSecret = config.get('KEYCLOAK_CLIENT_SECRET');
    return new KeycloakConnect({ store: new session.MemoryStore() }, {
      bearerOnly: true,
      clientId: config.get('KEYCLOAK_CLIENT_ID'),
      realm: config.get('KEYCLOAK_REALM') || '',
      serverUrl: `${config.get('KEYCLOAK_BASE_URL')}/auth`,
      credentials: {
        ...(clientSecret ? { secret: clientSecret } : {})
      }
    } as unknown as any);
  }
};

export default KeycloakProvider;
