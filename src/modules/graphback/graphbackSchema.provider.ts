import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { GraphbackAPI } from 'graphback';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GRAPHBACK } from './graphback.provider';

export const GRAPHBACK_SCHEMA = 'GRAPHBACK_SCHEMA';

const GraphbackSchemaProvider: FactoryProvider<GraphQLSchema> = {
  provide: GRAPHBACK_SCHEMA,
  useFactory: ({ typeDefs, resolvers }: GraphbackAPI) => {
    return makeExecutableSchema({
      typeDefs,
      resolvers
    });
  },
  inject: [GRAPHBACK]
};

export default GraphbackSchemaProvider;
