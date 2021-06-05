import path from 'path';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphbackAPI, GraphbackContext } from 'graphback';
import { Injectable, Inject, Req } from '@nestjs/common';
import { Keycloak } from 'keycloak-connect';
import { KeycloakContext, GrantedRequest } from 'keycloak-connect-graphql';
import { GRAPHBACK } from '~/modules/graphback';
import { HashMap } from '~/types';
import { KEYCLOAK } from '~/modules/keycloak';
import GraphqlSchemaService from './graphqlSchema.service';

const rootPath = path.resolve(__dirname, '../../..');

@Injectable()
export default class GraphqlService implements GqlOptionsFactory {
  constructor(
    @Inject(GRAPHBACK) private graphback: GraphbackAPI,
    @Inject(KEYCLOAK) private keycloak: Keycloak,
    private graphqlSchemaService: GraphqlSchemaService,
    private configService: ConfigService
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const datamodelUpdated = await this.graphqlSchemaService.datamodelUpdated();
    return {
      cors: this.configService.get('CORS') === '1',
      debug: this.configService.get('DEBUG') === '1',
      resolvers: datamodelUpdated ? [] : [this.graphback.resolvers],
      schema: await this.graphqlSchemaService.getSchema(),
      autoSchemaFile: datamodelUpdated
        ? path.resolve(rootPath, 'node_modules/.tmp/schema.graphql')
        : undefined,
      context: (context: HashMap & { req: GrantedRequest }) => {
        const { req } = context;
        // console.log(Object.keys(req));
        const graphbackContext: GraphbackContext =
          this.graphback.contextCreator(context);
        const kauth = new KeycloakContext({ req: context.req }, this.keycloak);
        // console.log(kauth.accessToken);
        return {
          ...graphbackContext,
          kauth,
          req
        };
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
