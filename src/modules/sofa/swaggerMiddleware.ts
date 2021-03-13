import * as swaggerUi from 'swagger-ui-express';
import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from '@nestjs/common/interfaces';
import { compose } from 'compose-middleware';
import { OpenApiResponse, OPEN_API } from './openApiProvider';

@Injectable()
export default class SwaggerMiddleware implements NestMiddleware {
  constructor(@Inject(OPEN_API) private openApi: OpenApiResponse) {}

  use(req: Request, res: Response, next: NextFunction) {
    const thing = this.openApi.get();
    compose([
      ...(swaggerUi.serve as RequestHandler[]),
      swaggerUi.setup(thing) as RequestHandler
    ])(req, res, next);
  }
}
