/**
 * File: /src/modules/graphback/graphbackSchema.provider.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:35:35
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
