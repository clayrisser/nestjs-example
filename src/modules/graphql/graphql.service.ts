import path from 'path';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { GraphbackAPI, GraphbackContext } from 'graphback';
import { Injectable, Inject } from '@nestjs/common';
import { Keycloak } from 'keycloak-connect';
import { KeycloakContext, GrantedRequest } from 'keycloak-connect-graphql';
import { GRAPHBACK, GRAPHBACK_SCHEMA } from '~/modules/graphback';
import { HashMap } from '~/types';
import { KEYCLOAK } from '~/modules/keycloak';

const rootPath = path.resolve(__dirname, '../../..');

@Injectable()
export default class GraphqlService implements GqlOptionsFactory {
  constructor(
    @Inject(GRAPHBACK) private graphback: GraphbackAPI,
    @Inject(GRAPHBACK_SCHEMA) private graphbackSchema: GraphQLSchema,
    @Inject(KEYCLOAK) private keycloak: Keycloak,
    private configService: ConfigService
  ) {}

  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      context: (context: HashMap & { req: GrantedRequest }) => {
        const graphbackContext: GraphbackContext = this.graphback.contextCreator(
          context
        );
        return {
          kauth: new KeycloakContext({ req: context.req }, this.keycloak),
          ...graphbackContext
        };
      },
      debug: this.configService.get('DEBUG') === '1',
      autoSchemaFile: path.resolve(
        rootPath,
        'node_modules/.tmp/schema.graphql'
      ),
      cors: this.configService.get('CORS') === '1',
      resolvers: [this.graphback.resolvers],
      typeDefs: this.graphback.typeDefs,
      schema: this.graphbackSchema,
      resolverValidationOptions: {
        // @ts-ignore
        allowResolversNotInSchema: true
      },
      playground:
        this.configService.get('GRAPHQL_PLAYGROUND') === '1' ||
        this.configService.get('DEBUG') === '1'
          ? {
              settings: {
                'request.credentials': 'include'
              }
            }
          : false
    };
  }
}
