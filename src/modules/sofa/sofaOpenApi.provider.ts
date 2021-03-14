import fs from 'fs-extra';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { OpenAPI, createSofaRouter } from 'sofa-api';
import { OpenAPIObject } from '@nestjs/swagger';
import { RouteInfo } from 'sofa-api/types';
import { SofaConfig } from 'sofa-api/sofa';
import { SOFA_CONFIG } from './sofaConfig.provider';
import { SOFA_SCHEMA } from './sofaSchema.provider';

const rootPath = path.resolve(__dirname, '../../..');

export const SOFA_OPEN_API = 'SOFA_OPEN_API';

const OpenApiProvider: FactoryProvider<SofaOpenApi> = {
  provide: SOFA_OPEN_API,
  inject: [SOFA_SCHEMA, SOFA_CONFIG],
  useFactory: (sofaSchema: GraphQLSchema, sofaConfig: SofaConfig) => {
    const pkg: Pkg = JSON.parse(
      fs.readFileSync(path.resolve(rootPath, 'package.json')).toString()
    );
    const openApi = OpenAPI({
      schema: sofaSchema,
      info: {
        description: pkg.description || '',
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
  description?: string;
  name: string;
  version: string;
  [key: string]: any;
}

export interface SofaOpenApi {
  addRoute(
    info: RouteInfo,
    config?:
      | {
          basePath?: string | undefined;
        }
      | undefined
  ): void;
  get(): OpenAPIObject;
  save(filepath: string): void;
}
