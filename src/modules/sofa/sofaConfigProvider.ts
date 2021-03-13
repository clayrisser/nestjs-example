import { FactoryProvider } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { SofaConfig } from 'sofa-api/sofa';
import { SCHEMA } from '~/modules/graphback';

export const SOFA_CONFIG = 'SOFA_CONFIG';

const SofaConfigProvider: FactoryProvider<SofaConfig> = {
  provide: SOFA_CONFIG,
  inject: [SCHEMA],
  useFactory: (schema: GraphQLSchema) => ({
    schema,
    basePath: '/api',
    method: {
      'Mutation.deleteNote': 'DELETE',
      'Mutation.updateNote': 'PUT'
    }
    // async execute({
    //   contextValue,
    //   operationName,
    //   source,
    //   variableValues
    // }: GraphQLArgs) {
    //   const { req } = contextValue;
    //   // TODO: prob don't need this
    //   const variables =
    //     (Object.keys(variableValues || {}).length
    //       ? variableValues
    //       : req.body) || {};
    //   const result = await apolloServer.executeOperation({
    //     query: source as string,
    //     variables,
    //     http: req,
    //     operationName: operationName || ''
    //   });
    //   return (result as unknown) as any;
    // },
    // errorHandler: this.handleError.bind(this)
    // onRoute: (info: RouteInfo) => {
    //   openApi.addRoute(info, { basePath: '/api' });
    // }
  })
};

export default SofaConfigProvider;

// handleError(errs: readonly any[]) {
//   (errs || []).forEach((err: any) => {
//     logger.error(new Error(err));
//   });
//   return {
//     type: 'error' as 'error',
//     status: 500,
//     statusMessage: '',
//     error: errs[0]
//   };
// }
