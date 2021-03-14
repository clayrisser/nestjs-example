import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { GraphbackAPI, GraphbackContext } from 'graphback';
import { Injectable, Inject } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { GRAPHBACK, GRAPHBACK_SCHEMA } from '~/modules/graphback';

const rootPath = path.resolve(__dirname, '../../..');

@Injectable()
export default class GraphbackGraphqlService implements GqlOptionsFactory {
  constructor(
    @Inject(GRAPHBACK) private graphback: GraphbackAPI,
    @Inject(GRAPHBACK_SCHEMA) private graphbackSchema: GraphQLSchema,
    private configService: ConfigService
  ) {}

  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      context: (context: any) => {
        const graphbackContext: GraphbackContext = this.graphback.contextCreator(
          context
        );
        return {
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
