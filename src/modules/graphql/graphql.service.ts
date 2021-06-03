import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { GraphbackAPI, GraphbackContext } from 'graphback';
import { Injectable, Inject } from '@nestjs/common';
import { Keycloak } from 'keycloak-connect';
import { KeycloakContext, GrantedRequest } from 'keycloak-connect-graphql';
import { GRAPHBACK } from '~/modules/graphback';
import { HashMap } from '~/types';
import { KEYCLOAK } from '~/modules/keycloak';
import { SOFA_SCHEMA } from '~/modules/sofa';

@Injectable()
export default class GraphqlService implements GqlOptionsFactory {
  constructor(
    @Inject(GRAPHBACK) private graphback: GraphbackAPI,
    @Inject(KEYCLOAK) private keycloak: Keycloak,
    @Inject(SOFA_SCHEMA) private sofaSchema: GraphQLSchema,
    private configService: ConfigService
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    return {
      debug: this.configService.get('DEBUG') === '1',
      cors: this.configService.get('CORS') === '1',
      resolvers: [this.graphback.resolvers],
      schema: this.sofaSchema,
      context: (context: HashMap & { req: GrantedRequest }) => {
        const graphbackContext: GraphbackContext =
          this.graphback.contextCreator(context);
        return {
          kauth: new KeycloakContext({ req: context.req }, this.keycloak),
          ...graphbackContext
        };
      },
      resolverValidationOptions: {
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
