import fs from 'fs-extra';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';
import { GRAPHBACK_SCHEMA } from '~/modules/graphback';
import { restart, onBootstrapped } from '~/bootstrap';

const logger = console;
const rootPath = path.resolve(__dirname, '../../..');

export const SOFA_SCHEMA = 'SOFA_SCHEMA';

const SofaSchemaProvider: FactoryProvider<Promise<GraphQLSchema>> = {
  provide: SOFA_SCHEMA,
  inject: [GRAPHBACK_SCHEMA],
  useFactory: async (graphbackSchema: GraphQLSchema) => {
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
      logger.info('generated schema');
      onBootstrapped(async () => {
        logger.info('restarting server . . .');
        await restart();
      });
    }
    return mergeSchemas({
      schemas: [...(nestjsSchema ? [nestjsSchema] : []), graphbackSchema]
    });
  }
};

export default SofaSchemaProvider;
