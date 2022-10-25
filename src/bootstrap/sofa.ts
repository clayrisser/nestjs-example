/**
 * File: /src/bootstrap/sofa.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 25-10-2022 06:18:59
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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
import {
  DocumentNode,
  ExecutionArgs,
  ExecutionResult,
  GraphQLFieldResolver,
  GraphQLSchema,
  GraphQLTypeResolver,
} from 'graphql';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { Maybe } from 'graphql/jsutils/Maybe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { PromiseOrValue } from 'graphql/jsutils/PromiseOrValue';
import { SofaModule, SOFA_CONFIG } from 'app/modules/core/sofa';
import { getApolloServer } from '@nestjs/apollo';
import { useSofa, SofaConfig } from '@risserlabs/sofa-api';

export async function registerSofa(app: NestExpressApplication, schema: GraphQLSchema): Promise<INestApplication> {
  const sofa = await NestFactory.create(SofaModule.register(schema));
  const config: SofaConfig = sofa.get(SOFA_CONFIG);
  config.execute = createSofaExecute(() => getApolloServer(app));
  app.use(app.get(ConfigService).get('SOFA_BASE_PATH') || 'sofa', useSofa(config));
  return sofa;
}

export function createSofaExecute(getApolloServer: () => ApolloServerBase) {
  function execute(args: ExecutionArgs): PromiseOrValue<ExecutionResult>;
  function execute(
    schema: GraphQLSchema,
    document: DocumentNode,
    rootValue?: any,
    contextValue?: any,
    variableValues?: Maybe<{ [key: string]: any }>,
    operationName?: Maybe<string>,
    fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
    typeResolver?: Maybe<GraphQLTypeResolver<any, any>>,
  ): PromiseOrValue<ExecutionResult>;
  async function execute(
    argsOrSchema: ExecutionArgs | GraphQLSchema,
    maybeDocument?: DocumentNode,
    _rootValue?: any,
    maybeContextValue?: any,
    maybeVariableValues?: Maybe<{ [key: string]: any }>,
    maybeOperationName?: Maybe<string>,
    _fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
    _typeResolver?: Maybe<GraphQLTypeResolver<any, any>>,
  ) {
    const args = !maybeDocument ? (argsOrSchema as ExecutionArgs) : undefined;
    const document = args ? args.document : maybeDocument!;
    const contextValue = args ? args.contextValue : maybeContextValue;
    const operationName = args ? args.operationName : maybeOperationName;
    const variableValues = args ? args.variableValues : maybeVariableValues;
    const { req } = contextValue;
    const variables = (Object.keys(variableValues || {}).length ? variableValues : req.body) || {};
    return (await getApolloServer().executeOperation(
      {
        http: req,
        operationName: operationName || '',
        query: document,
        variables,
      },
      { req },
    )) as ExecutionResult;
  }
  return execute;
}
