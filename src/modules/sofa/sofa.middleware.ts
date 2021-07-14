/**
 * File: /src/modules/sofa/sofa.middleware.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:36:14
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
