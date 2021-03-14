import { ErrorHandler } from 'sofa-api/express';
import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { SofaConfig } from 'sofa-api/sofa';
import { SOFA_ERROR_HANDLER } from './sofaErrorHandler.provider';
import { SOFA_SCHEMA } from './sofaSchema.provider';

export const SOFA_CONFIG = 'SOFA_CONFIG';

const SofaConfigProvider: FactoryProvider<SofaConfig> = {
  provide: SOFA_CONFIG,
  inject: [SOFA_SCHEMA, SOFA_ERROR_HANDLER],
  useFactory: (schema: GraphQLSchema, sofaErrorHandler: ErrorHandler) => ({
    schema,
    basePath: '/api',
    method: {
      'Mutation.deleteNote': 'DELETE',
      'Mutation.updateNote': 'PUT'
    },
    errorHandler: sofaErrorHandler
  })
};

export default SofaConfigProvider;
