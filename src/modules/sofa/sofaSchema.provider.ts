import fs from 'fs-extra';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';
import { GRAPHBACK_SCHEMA } from '~/modules/graphback';

const logger = console;
const rootPath = path.resolve(__dirname, '../../..');

export const SOFA_SCHEMA = 'SOFA_SCHEMA';

const SofaSchemaProvider: FactoryProvider<GraphQLSchema> = {
  provide: SOFA_SCHEMA,
  inject: [GRAPHBACK_SCHEMA],
  useFactory: (graphbackSchema: GraphQLSchema) => {
    const nestjsSchemaPath = path.resolve(
      rootPath,
      'node_modules/.tmp/schema.graphql'
    );
    let nestjsSchema: GraphQLSchema | undefined;
    if (fs.pathExistsSync(nestjsSchemaPath)) {
      nestjsSchema = makeExecutableSchema({
        typeDefs: fs.readFileSync(nestjsSchemaPath).toString()
      });
    } else {
      logger.warn('generated schema . . . please restart for changes to apply');
      setTimeout(process.exit, 5000);
    }
    return mergeSchemas({
      schemas: [...(nestjsSchema ? [nestjsSchema] : []), graphbackSchema]
    });
  }
};

export default SofaSchemaProvider;
