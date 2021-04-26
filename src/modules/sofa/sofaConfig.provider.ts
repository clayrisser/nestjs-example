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
      method: {
        'Mutation.deleteNote': 'DELETE',
        'Mutation.updateNote': 'PUT'
      },
      name: {},
      calculateMethod(
        method: Method,
        _kind: Kind,
        _operationDefinitionNode: OperationDefinitionNode
      ) {
        return method;
      },
      calculatePath(
        path: string,
        _kind: Kind,
        _operationDefinitionNode: OperationDefinitionNode
      ) {
        path = path.replace(/create-/g, '');
        path = path.replace(/delete-/g, '');
        path = path.replace(/find-/g, '');
        path = path.replace(/get-/g, '');
        path = path.replace(/mutation-/g, '');
        path = path.replace(/update-/g, '');
        return path;
      },
      errorHandler: sofaErrorHandler
    } as SofaConfig)
};

export default SofaConfigProvider;
