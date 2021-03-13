import fs from 'fs-extra';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { OpenAPI, createSofaRouter } from 'sofa-api';
import { RouteInfo } from 'sofa-api/types';
import { SofaConfig } from 'sofa-api/sofa';
import { SCHEMA } from '~/modules/graphback';
import { SOFA_CONFIG } from './sofaConfigProvider';

export const OPEN_API = 'OPEN_API';

const OpenApiProvider: FactoryProvider<OpenApiResponse> = {
  provide: OPEN_API,
  inject: [SCHEMA, SOFA_CONFIG],
  useFactory: (schema: GraphQLSchema, sofaConfig: SofaConfig) => {
    const pkg: Pkg = JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, '../../../package.json'))
        .toString()
    );
    const openApi = OpenAPI({
      schema,
      info: {
        title: pkg.name,
        version: pkg.version
      }
    });
    const clonedSofaConfig = { ...sofaConfig };
    clonedSofaConfig.onRoute = (info: RouteInfo) => {
      openApi.addRoute(info, { basePath: '/api' });
    };
    createSofaRouter(clonedSofaConfig);
    delete sofaConfig.onRoute;
    return openApi;
  }
};

export default OpenApiProvider;

export interface Pkg {
  name: string;
  version: string;
  [key: string]: any;
}

export interface OpenApiResponse {
  addRoute(
    info: RouteInfo,
    config?:
      | {
          basePath?: string | undefined;
        }
      | undefined
  ): void;
  get(): any;
  save(filepath: string): void;
}
