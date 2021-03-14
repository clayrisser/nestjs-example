import fs from 'fs-extra';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';
import { GRAPHBACK_SCHEMA } from '~/modules/graphback';

const rootPath = path.resolve(__dirname, '../../..');

export const SOFA_SCHEMA = 'SOFA_SCHEMA';

const SofaSchemaProvider: FactoryProvider<GraphQLSchema> = {
  provide: SOFA_SCHEMA,
  inject: [GRAPHBACK_SCHEMA],
  useFactory: (graphbackSchema: GraphQLSchema) => {
    const nestjsSchema = makeExecutableSchema({
      typeDefs: fs
        .readFileSync(
          path.resolve(rootPath, 'node_modules/.tmp/schema.graphql')
        )
        .toString()
    });
    return mergeSchemas({
      schemas: [nestjsSchema, graphbackSchema]
    });
  }
};

export default SofaSchemaProvider;
