import { ApolloServerBase } from 'apollo-server-core';
import { GraphQLArgs } from 'graphql';
import { GraphQLModule } from '@nestjs/graphql';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SOFA_CONFIG } from '~/modules/sofa';

type SofaConfig = import('sofa-api/sofa').SofaConfig;

export function registerSofa(
  app: NestExpressApplication | NestFastifyApplication
) {
  const { apolloServer } = app.get(GraphQLModule);
  const config: SofaConfig = app.get(SOFA_CONFIG);
  config.execute = createSofaExecute(apolloServer);
}

export function createSofaExecute(apolloServer: ApolloServerBase) {
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
    const result = await apolloServer.executeOperation({
      query: source as string,
      variables,
      http: req,
      operationName: operationName || ''
    });
    return (result as unknown) as any;
  };
}
