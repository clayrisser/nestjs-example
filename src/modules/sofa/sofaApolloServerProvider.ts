import { ApolloServer } from 'apollo-server-express';
import { FactoryProvider } from '@nestjs/common';
import { GraphbackAPI } from 'graphback';
import { GRAPHBACK } from '~/modules/graphback';

export const SOFA_APOLLO_SERVER = 'SOFA_APOLLO_SERVER';

const SofaApolloServerProvider: FactoryProvider<ApolloServer> = {
  provide: SOFA_APOLLO_SERVER,
  inject: [GRAPHBACK],
  useFactory: ({ typeDefs, resolvers, contextCreator }: GraphbackAPI) => {
    return new ApolloServer({
      typeDefs,
      resolvers: [resolvers],
      context: contextCreator
    });
  }
};

export default SofaApolloServerProvider;
