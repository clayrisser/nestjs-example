import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module, Global } from '@nestjs/common';
import GraphbackModule from '~/modules/graphback';
import KeycloakModule from '~/modules/keycloak';
import GraphqlModule from '~/modules/graphql';
import SofaModule from '~/modules/sofa';
import modules from '~/modules';
import { GraphqlService } from '~/modules/graphql';

const rootPath = path.resolve(__dirname, '..');

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [GraphbackModule, KeycloakModule, SofaModule, GraphqlModule],
      useClass: GraphqlService
    }),
    ConfigModule.forRoot({
      envFilePath: path.resolve(rootPath, '.env')
    }),
    ...modules
  ],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class AppModule {}
