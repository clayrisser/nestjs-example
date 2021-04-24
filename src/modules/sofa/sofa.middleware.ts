import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { useSofa } from '@codejamninja/sofa-api';
import { SOFA_CONFIG } from './sofaConfig.provider';

type SofaConfig = import('@codejamninja/sofa-api/sofa').SofaConfig;

@Injectable()
export default class SofaMiddleware implements NestMiddleware {
  constructor(@Inject(SOFA_CONFIG) private sofaConfig: SofaConfig) {}

  use(req: Request, res: Response, next: NextFunction) {
    useSofa(this.sofaConfig)(req, res, next);
  }
}
