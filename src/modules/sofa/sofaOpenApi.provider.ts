import fs from 'fs-extra';
import path from 'path';
import { FactoryProvider } from '@nestjs/common';
import { OpenAPI, createSofaRouter } from '@codejamninja/sofa-api';
import { OpenAPIObject } from '@nestjs/swagger';
import { RouteInfo } from '@codejamninja/sofa-api/types';
import { SofaConfig } from '@codejamninja/sofa-api/sofa';
import { GraphqlSchemaService } from '~/modules/graphql';
import { SOFA_CONFIG } from './sofaConfig.provider';

const rootPath = path.resolve(__dirname, '../../..');

export const SOFA_OPEN_API = 'SOFA_OPEN_API';

const OpenApiProvider: FactoryProvider<Promise<SofaOpenApi>> = {
  provide: SOFA_OPEN_API,
  inject: [GraphqlSchemaService, SOFA_CONFIG],
  useFactory: async (
    graphqlSchemaService: GraphqlSchemaService,
    sofaConfig: SofaConfig
  ) => {
    const pkg: Pkg = JSON.parse(
      fs.readFileSync(path.resolve(rootPath, 'package.json')).toString()
    );
    const openApi = OpenAPI({
      schema: await graphqlSchemaService.getSchema(),
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
