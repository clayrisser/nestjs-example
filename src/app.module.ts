import ConnectRedis from 'connect-redis';
import session from 'express-session';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module, Scope } from '@nestjs/common';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { RedisService, RedisModule, RedisModuleOptions } from 'nestjs-redis';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard
} from 'nestjs-keycloak';
import controllers from './controllers';
import providers from './providers';
import resolvers from './resolvers';
import services from './services';

const RedisStore = ConnectRedis(session);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KeycloakConnectModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        authServerUrl: `${config.get('KEYCLOAK_BASE_URL')}/auth`,
        clientId: config.get('KEYCLOAK_CLIENT_ID'),
        realm: config.get('KEYCLOAK_REALM'),
        secret: config.get('KEYCLOAK_SECRET')
      })
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        autoSchemaFile: 'src/schema.graphql',
        context: ({ req }): any => ({ req }),
        debug: config.get('DEBUG') === '1',
        playground: config.get('GRAPHQL_PLAYGROUND') === '1'
      })
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService): RedisModuleOptions => ({
        db: Number(config.get('REDIS_DATABASE') || 0),
        host: config.get('REDIS_HOST') || 'localhost',
        password: config.get('REDIS_PASSWORD') || '',
        port: Number(config.get('REDIS_PORT') || 6379)
      }),
      inject: [ConfigService]
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, RedisService],
      useFactory: async (
        config: ConfigService,
        redis: RedisService
      ): Promise<NestSessionOptions> => {
        const redisClient = redis.getClient();
        const store = new RedisStore({ client: redisClient as any });
        return { session: { secret: config.get('SECRET'), store } };
      }
    })
  ],
  controllers,
  providers: [
    {
      provide: APP_GUARD,
      scope: Scope.REQUEST,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      scope: Scope.REQUEST,
      useClass: ResourceGuard
    },
    ...providers,
    ...resolvers,
    ...services
  ]
})
export class AppModule {}
