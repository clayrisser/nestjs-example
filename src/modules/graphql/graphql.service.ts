/**
 * File: /src/modules/graphql/graphql.service.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:35:45
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

import path from 'path';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { GraphbackAPI, GraphbackContext } from 'graphback';
import { Injectable, Inject } from '@nestjs/common';
import { Keycloak } from 'keycloak-connect';
import { KeycloakContext, GrantedRequest } from 'keycloak-connect-graphql';
import { GRAPHBACK } from '~/modules/graphback';
import { HashMap } from '~/types';
import { KEYCLOAK } from '~/modules/keycloak';
import GraphqlSchemaService from './graphqlSchema.service';

const rootPath = path.resolve(__dirname, '../../..');

@Injectable()
export default class GraphqlService implements GqlOptionsFactory {
  constructor(
    @Inject(GRAPHBACK) private graphback: GraphbackAPI,
    @Inject(KEYCLOAK) private keycloak: Keycloak,
    private graphqlSchemaService: GraphqlSchemaService,
    private configService: ConfigService
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const datamodelUpdated = await this.graphqlSchemaService.datamodelUpdated();
    return {
      cors: this.configService.get('CORS') === '1',
      debug: this.configService.get('DEBUG') === '1',
      resolvers: datamodelUpdated ? [] : [this.graphback.resolvers],
      schema: await this.graphqlSchemaService.getSchema(),
      autoSchemaFile: datamodelUpdated
        ? path.resolve(rootPath, 'node_modules/.tmp/schema.graphql')
        : undefined,
      context: (context: HashMap & { req: GrantedRequest }) => {
        const { req } = context;
        const graphbackContext: GraphbackContext =
          this.graphback.contextCreator(context);
        const kauth = new KeycloakContext({ req: context.req }, this.keycloak);
        return {
          ...graphbackContext,
          kauth,
          req
        };
      },
      playground:
        this.configService.get('GRAPHQL_PLAYGROUND') === '1' ||
        this.configService.get('DEBUG') === '1'
          ? {
              settings: {
                'request.credentials': 'include'
              }
            }
          : false
    };
  }
}
