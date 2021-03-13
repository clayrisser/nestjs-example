import * as swaggerUi from 'swagger-ui-express';
import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from '@nestjs/common/interfaces';
import { compose } from 'compose-middleware';
import { SofaOpenApi, SOFA_OPEN_API } from './sofaOpenApi.provider';

@Injectable()
export default class SofaSwaggerMiddleware implements NestMiddleware {
  constructor(@Inject(SOFA_OPEN_API) private sofaOpenApi: SofaOpenApi) {}

  use(req: Request, res: Response, next: NextFunction) {
    const thing = this.sofaOpenApi.get();
    compose([
      ...(swaggerUi.serve as RequestHandler[]),
      swaggerUi.setup(thing) as RequestHandler
    ])(req, res, next);
  }
}
