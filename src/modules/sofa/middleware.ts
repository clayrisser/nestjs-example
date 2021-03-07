import { GraphQLSchema } from 'graphql';
import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
// eslint-disable-next-line import/no-unresolved
import { Request, Response, NextFunction } from 'express';
import { useSofa, OpenAPI } from 'sofa-api';
import { SCHEMA } from '~/modules/graphback';

const logger = console;

@Injectable()
export default class SofaMiddleware implements NestMiddleware {
  constructor(@Inject(SCHEMA) private schema: GraphQLSchema) {}

  handleError(errs: readonly any[]) {
    (errs || []).forEach((err: any) => {
      logger.error(new Error(err));
    });
    return {
      type: 'error' as 'error',
      status: 500,
      statusMessage: '',
      error: errs[0]
    };
  }

  use(req: Request, res: Response, next: NextFunction) {
    const openApi = OpenAPI({
      schema: this.schema,
      info: {
        title: 'Sofa API Example',
        version: '1.0.0'
      }
    });
    useSofa({
      schema: this.schema,
      basePath: '/api',
      method: {
        'Mutation.deleteNote': 'DELETE',
        'Mutation.updateNote': 'PUT'
      },
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
      errorHandler: this.handleError.bind(this),
      onRoute(info: any) {
        openApi.addRoute(info, { basePath: '/api' });
      }
    })(req, res, next);
  }
}
