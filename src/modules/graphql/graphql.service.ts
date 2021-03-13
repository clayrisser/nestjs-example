import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphbackAPI } from 'graphback';
import { Injectable, Inject } from '@nestjs/common';
import { GRAPHBACK } from '~/modules/graphback';

@Injectable()
export default class GraphqlService implements GqlOptionsFactory {
  constructor(
    @Inject(GRAPHBACK)
    private graphback: GraphbackAPI
  ) {}

  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      context: this.graphback.contextCreator,
      resolvers: [this.graphback.resolvers],
      typeDefs: this.graphback.typeDefs
    };
  }
}
