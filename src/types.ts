import { GraphbackContext } from 'graphback';
import { Request, Response } from 'express';

export enum Adapter {
  Express = 'express',
  Fastify = 'fastify'
}

export interface GraphqlCtx extends GraphbackContext {
  req: Request;
  res: Response;
}
