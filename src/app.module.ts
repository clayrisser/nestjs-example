import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import {
  KeycloakConnectModule,
  ResourceGuard
} from '@cenkce/nest-keycloak-connect';
import config, { Config } from './config';
import { AppController } from './controllers/app.controller';
import { AppResolver } from './resolvers/app.resolver';
import { AppService } from './services/app.service';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from './resolvers/auth/auth.module';
import { DateScalar } from './scalars/date.scalar';
import { UserModule } from './resolvers/user/user.module';

const controllers = [AppController, AuthController];
const modules = [AuthModule, UserModule];
const resolvers = [AppResolver];
const scalers = [DateScalar];
const services = [AppService];

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/auth',
      realm: 'tmp',
      clientId: 'appsaas-core',
      secret: 'shhh'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: 'src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1',
        playground: configService.get('PLAYGROUND_ENABLE') === '1',
        context: ({ req }): any => ({ req })
      }),
      inject: [ConfigService]
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [Config],
      useFactory: async (config: Config): Promise<NestSessionOptions> => {
        return {
          session: { secret: config.secret }
        };
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
    ...services,
    ...resolvers,
    ...scalers
  ]
})
export class AppModule {}
