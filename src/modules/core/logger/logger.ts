/**
 * File: /src/modules/logger/logger.ts
 * Project: app
 * File Created: 22-10-2022 06:38:15
 * Author: Clay Risser
 * -----
 * Last Modified: 22-10-2022 08:49:53
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

import Pino, { Logger, destination } from 'pino';
import path from 'path';
import { trace, context } from '@opentelemetry/api';

const { env } = process;

export const logger: Logger = Pino(
  {
    level: 'info',
    formatters: {
      level(label) {
        return { level: label };
      },
      log(object) {
        const span = trace.getSpan(context.active());
        if (!span) return { ...object };
        const { spanId, traceId } = trace.getSpan(context.active())?.spanContext() || {};
        return { ...object, spanId, traceId };
      },
    },
  },
  destination(env.LOG_FILE_NAME ? path.resolve(process.cwd(), env.LOG_FILE_NAME) : undefined),
);
