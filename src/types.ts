import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma-module';

export enum Adapter {
  Express = 'express',
  Fastify = 'fastify'
}

export interface SessionData {
  count: number;
}

export interface GraphqlCtx {
  prisma: PrismaService;
  req: Request;
}
