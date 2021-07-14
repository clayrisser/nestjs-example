/**
 * File: /src/bootstrap/sofa.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:19:44
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    const result = await getApolloServer().executeOperation(
      {
        query: source as string,
        variables,
        http: req,
        operationName: operationName || ''
      },
      { req }
    );
    return result as unknown as any;
  };
}
