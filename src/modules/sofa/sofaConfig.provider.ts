import { ErrorHandler } from '@codejamninja/sofa-api/express';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { SofaConfig } from '@codejamninja/sofa-api/sofa';
import { Kind, Method } from '@codejamninja/sofa-api/types';
import { SOFA_ERROR_HANDLER } from './sofaErrorHandler.provider';
import { SOFA_SCHEMA } from './sofaSchema.provider';

export const SOFA_CONFIG = 'SOFA_CONFIG';

const SofaConfigProvider: FactoryProvider<SofaConfig> = {
  provide: SOFA_CONFIG,
  inject: [SOFA_SCHEMA, SOFA_ERROR_HANDLER],
  useFactory: (schema: GraphQLSchema, sofaErrorHandler: ErrorHandler) =>
    ({
      schema,
      basePath: '/api',
      method: {},
      name: {},
      calculateMethod(
        method: Method,
        kind: Kind,
        { name }: OperationDefinitionNode
      ) {
        switch (kind) {
          case 'query': {
            return 'GET';
            break;
          }
          case 'mutation': {
            if (/^delete/.test(name?.value || '')) {
              return 'DELETE';
            }
            if (/^update/.test(name?.value || '')) {
              return 'PUT';
            }
            if (/^create/.test(name?.value || '')) {
              return 'POST';
            }
            if (/^mutation/.test(name?.value || '')) {
              return 'POST';
            }
            break;
          }
        }
        return method;
      },
      calculatePath(
        path: string,
        kind: Kind,
        _operationDefinitionNode: OperationDefinitionNode
      ) {
        switch (kind) {
          case 'query': {
            path = path.replace(/^\/find-/g, '/');
            path = path.replace(/^\/get-/g, '/');
            break;
          }
          case 'mutation': {
            path = path.replace(/^\/create-/g, '/');
            path = path.replace(/^\/delete-/g, '/');
            path = path.replace(/^\/mutation-/g, '/');
            path = path.replace(/^\/update-/g, '/');
            break;
          }
        }
        return path;
      },
      errorHandler: sofaErrorHandler
    } as SofaConfig)
};

export default SofaConfigProvider;
