import { Request } from 'express';

export enum Adapter {
  Express = 'express',
  Fastify = 'fastify'
}

export interface GraphqlCtx {
  req: Request;
}
