import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { GraphbackAPI } from 'graphback';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GRAPHBACK } from './provider';

export const SCHEMA = 'SCHEMA';

const SchemaProvider: FactoryProvider<GraphQLSchema> = {
  provide: SCHEMA,
  useFactory: ({ typeDefs, resolvers }: GraphbackAPI) => {
    return makeExecutableSchema({
      typeDefs,
      resolvers
    });
  },
  inject: [GRAPHBACK]
};

export default SchemaProvider;
