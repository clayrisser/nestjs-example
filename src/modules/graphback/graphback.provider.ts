// import { MongoClient } from 'mongodb';
// import { createMongoDbProvider } from '@graphback/runtime-mongo';
import Knex from 'knex';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { buildGraphbackAPI, GraphbackAPI } from 'graphback';
import { createKnexDbProvider } from '@graphback/runtime-knex';
import { migrateDB, removeNonSafeOperationsFilter } from 'graphql-migrations';
import { readFileSync } from 'fs';

const logger = console;

export const GRAPHBACK = 'GRAPHBACK';

const GraphbackProvider: FactoryProvider<Promise<GraphbackAPI>> = {
  provide: GRAPHBACK,
  useFactory: async () => {
    // const URL = 'mongodb://localhost:27017';
    // const DATABASE = 'todo';
    // const client = await MongoClient.connect(URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // });
    // const db = client.db(DATABASE);
    // const dataProviderCreator = createMongoDbProvider(db);

    const dbConfig = {
      client: 'pg',
      connection: {
        user: 'postgres',
        password: 'postgres',
        database: 'postgres',
        host: 'localhost',
        port: Number(process.env.DB_PORT || 5432)
      },
      pool: { min: 5, max: 30 }
    };
    const db = Knex(dbConfig);
    const dataProviderCreator = createKnexDbProvider(db);

    const userModel = readFileSync(
      path.resolve(__dirname, '../../../model/datamodel.graphql'),
      'utf8'
    );
    const result = buildGraphbackAPI(userModel, {
      dataProviderCreator
    });
    migrateDB(dbConfig, result.typeDefs, {
      operationFilter: removeNonSafeOperationsFilter
    }).then(() => {
      logger.log('Migrated database');
    });
    return result;
  }
};

export default GraphbackProvider;
