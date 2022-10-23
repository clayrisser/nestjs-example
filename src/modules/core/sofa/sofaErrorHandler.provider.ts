/**
 * File: /src/modules/core/sofa/sofaErrorHandler.provider.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 23-10-2022 04:02:50
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import { ErrorHandler } from '@risserlabs/sofa-api/dist/express';
import { FactoryProvider, Logger } from '@nestjs/common';

const logger = new Logger('SofaErrorHandler');

export const SOFA_ERROR_HANDLER = 'SOFA_ERROR_HANDLER';

export const SofaErrorHandlerProvider: FactoryProvider<ErrorHandler> = {
  provide: SOFA_ERROR_HANDLER,
  useFactory: () => {
    return (errs: readonly any[]) => {
      (errs || []).forEach((err: any) => {
        logger.error(new Error(err));
      });
      return {
        type: 'error' as 'error',
        status: 500,
        statusMessage: '',
        error: errs[0],
      };
    };
  },
};
