import { ApolloServerBase } from 'apollo-server-core';
import { GraphQLArgs } from 'graphql';
import { GraphQLModule } from '@nestjs/graphql';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SofaConfig } from '@codejamninja/sofa-api/sofa';
import { SOFA_CONFIG } from '~/modules/sofa';

export function registerSofa(
  app: NestExpressApplication | NestFastifyApplication
) {
  const graphQLModule = app.get(GraphQLModule);
  const config: SofaConfig = app.get(SOFA_CONFIG);
  config.execute = createSofaExecute(() => graphQLModule.apolloServer);
}

export function createSofaExecute(getApolloServer: () => ApolloServerBase) {
  return async ({
    contextValue,
    operationName,
    source,
    variableValues
  }: GraphQLArgs) => {
    const { req } = contextValue;
    const variables =
      (Object.keys(variableValues || {}).length ? variableValues : req.body) ||
      {};
    const result = await getApolloServer().executeOperation({
      query: source as string,
      variables,
      http: req,
      operationName: operationName || ''
    });
    return result as unknown as any;
  };
}
