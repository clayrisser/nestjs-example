import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { buildGraphbackAPI, GraphbackAPI } from 'graphback';
import { createMongoDbProvider } from '@graphback/runtime-mongo';
import { readFileSync } from 'fs';

export const URL = 'mongodb://localhost:27017';
export const DATABASE = 'todo';
export const GRAPHBACK = 'GRAPHBACK';

const GraphbackProvider: FactoryProvider<Promise<GraphbackAPI>> = {
  provide: GRAPHBACK,
  useFactory: async () => {
    const client = await MongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = client.db(DATABASE);
    const dataProviderCreator = createMongoDbProvider(db);
    const userModel = readFileSync(
      path.resolve(__dirname, '../../../model/datamodel.graphql'),
      'utf8'
    );
    return buildGraphbackAPI(userModel, {
      dataProviderCreator
    });
  }
};

export default GraphbackProvider;
