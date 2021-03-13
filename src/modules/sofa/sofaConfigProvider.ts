import { ErrorHandler } from 'sofa-api/express';
import { ExecuteFn } from 'sofa-api/types';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { SofaConfig } from 'sofa-api/sofa';
import { GRAPHBACK_SCHEMA } from '~/modules/graphback';
import { SOFA_EXECUTE } from './sofaExecuteProvider';
import { SOFA_ERROR_HANDLER } from './sofaErrorHandlerProvider';

export const SOFA_CONFIG = 'SOFA_CONFIG';

const SofaConfigProvider: FactoryProvider<SofaConfig> = {
  provide: SOFA_CONFIG,
  inject: [GRAPHBACK_SCHEMA, SOFA_EXECUTE, SOFA_ERROR_HANDLER],
  useFactory: (
    schema: GraphQLSchema,
    sofaExecute: ExecuteFn,
    sofaErrorHandler: ErrorHandler
  ) => ({
    schema,
    basePath: '/api',
    method: {
      'Mutation.deleteNote': 'DELETE',
      'Mutation.updateNote': 'PUT'
    },
    execute: sofaExecute,
    errorHandler: sofaErrorHandler
  })
};

export default SofaConfigProvider;
