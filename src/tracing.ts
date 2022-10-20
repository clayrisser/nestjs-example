/**
 * File: /src/tracing.ts
 * Project: app
 * File Created: 20-10-2022 01:37:19
 * Author: Clay Risser
 * -----
 * Last Modified: 20-10-2022 10:15:13
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

import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator } from '@opentelemetry/core';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const logger = console;
const otelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: 8081,
  }),
  spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [new ExpressInstrumentation(), new NestInstrumentation()],
});

process.on('SIGTERM', () =>
  otelSDK
    .shutdown()
    .catch((err) => logger.error(err))
    .finally(() => process.exit(0)),
);

export default otelSDK;
