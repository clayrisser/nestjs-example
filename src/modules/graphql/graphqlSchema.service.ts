/**
 * File: /src/modules/graphql/graphqlSchema.service.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:35:48
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

import fs from 'fs-extra';
import path from 'path';
import { GraphQLSchema } from 'graphql';
import { Injectable, Inject } from '@nestjs/common';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeSchemas } from '@graphql-tools/merge';
import { GRAPHBACK_SCHEMA } from '~/modules/graphback';
import { restart, onBootstrapped } from '~/bootstrap';

const rootPath = path.resolve(__dirname, '../../..');
const logger = console;

@Injectable()
export default class GraphqlSchemaService {
  constructor(
    @Inject(GRAPHBACK_SCHEMA) private graphbackSchema: GraphQLSchema
  ) {}

  private _schema: GraphQLSchema | null = null;

  private _loadingSchema = false;

  private _schemaLoadedResolvers: SchemaLoadedResolver[] = [];

  schemaPath = path.resolve(rootPath, 'node_modules/.tmp/schema.graphql');

  datamodelPath = path.resolve(rootPath, 'model/datamodel.graphql');

  get loadingSchema() {
    return this._loadingSchema;
  }

  async datamodelUpdated() {
    if (!(await fs.pathExists(this.schemaPath))) return true;
    const datamodelStat = await fs.stat(this.datamodelPath);
    const schemaStat = await fs.stat(this.schemaPath);
    return datamodelStat.mtime.getTime() > schemaStat.mtime.getTime();
  }

  async getSchema(): Promise<GraphQLSchema> {
    if (this._schema) return this._schema;
    if (this._loadingSchema) {
      return new Promise((resolve) => {
        this._schemaLoadedResolvers.push(resolve);
      });
    }
    this._loadingSchema = true;
    let nestjsSchema: GraphQLSchema | undefined;
    if (await this.datamodelUpdated()) {
      logger.info('generated schema');
      onBootstrapped(async () => {
        logger.info('restarting server . . .');
        await restart();
      });
    } else {
      nestjsSchema = makeExecutableSchema({
        typeDefs: fs.readFileSync(this.schemaPath).toString()
      });
    }
    const schema = mergeSchemas({
      schemas: [...(nestjsSchema ? [nestjsSchema] : []), this.graphbackSchema]
    });
    this._schema = schema;
    this._loadingSchema = false;
    this._schemaLoadedResolvers.forEach((resolve: SchemaLoadedResolver) =>
      resolve(schema)
    );
    return schema;
  }
}

type SchemaLoadedResolver = (schema: GraphQLSchema) => any;
