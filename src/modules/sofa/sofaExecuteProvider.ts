import { ApolloServer } from 'apollo-server';
import { ExecuteFn } from 'sofa-api/types';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLArgs } from 'graphql';
import { SOFA_APOLLO_SERVER } from './sofaApolloServerProvider';

export const SOFA_EXECUTE = 'SOFA_EXECUTE';

const SofaExecuteProvider: FactoryProvider<ExecuteFn> = {
  provide: SOFA_EXECUTE,
  inject: [SOFA_APOLLO_SERVER],
  useFactory: (sofaApolloServer: ApolloServer) => {
    return async ({
      contextValue,
      operationName,
      source,
      variableValues
    }: GraphQLArgs) => {
      const { req } = contextValue;
      const variables =
        (Object.keys(variableValues || {}).length
          ? variableValues
          : req.body) || {};
      const result = await sofaApolloServer.executeOperation({
        query: source as string,
        variables,
        http: req,
        operationName: operationName || ''
      });
      return (result as unknown) as any;
    };
  }
};

export default SofaExecuteProvider;
