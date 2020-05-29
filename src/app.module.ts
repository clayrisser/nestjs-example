import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import {
  KeycloakConnectModule,
  ResourceGuard
} from '@cenkce/nest-keycloak-connect';
import { AppController } from './controllers/app.controller';
import { AppResolver } from './resolvers/app.resolver';
import { AppService } from './services/app.service';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from './resolvers/auth/auth.module';
import { AxiosProvider } from './providers/axios.provider';
import { DateScalar } from './scalars/date.scalar';
import { KeycloakService } from './services/keycloak.service';
import { UserModule } from './resolvers/user/user.module';

const controllers = [AppController, AuthController];
const modules = [AuthModule, UserModule];
const providers = [AxiosProvider];
const resolvers = [AppResolver];
const scalers = [DateScalar];
const services = [AppService, KeycloakService];
const { env } = process;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KeycloakConnectModule.register({
      authServerUrl: `${env.KEYCLOAK_BASE_URL}/auth`,
      clientId: env.KEYCLOAK_CLIENT_ID,
      realm: env.KEYCLOAK_REALM,
      secret: env.KEYCLOAK_SECRET
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
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService
      ): Promise<NestSessionOptions> => {
        return { session: { secret: config.get('SECRET') } };
      }
    }),
    ...modules
  ],
  controllers,
  providers: [
    {
      provide: APP_GUARD,
      useClass: ResourceGuard
    },
    ...providers,
    ...services,
    ...resolvers,
    ...scalers
  ]
})
export class AppModule {}
