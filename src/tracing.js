/**
 * File: /src/tracing.js
 * Project: example-nestjs
 * File Created: 24-07-2021 06:45:41
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 24-07-2021 07:58:16
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

const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { ResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const logger = console;
const { env } = process;
const serviceName = `${
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"))).name
}:node`;

class PatchedJaegerExporter extends JaegerExporter {
  export(spans, resultCallback) {
    super.export(
      spans.map((span) => {
        if (!span.resource) span.resource = {};
        if (!span.resource.attributes) span.resource.attributes = {};
        span.resource.attributes = Object.entries(
          span.resource.attributes || []
        ).reduce((attributes, [key, value]) => {
          attributes[key] =
            key === ResourceAttributes.SERVICE_NAME ? serviceName : value;
          return attributes;
        }, {});
        return span;
      }),
      resultCallback
    );
  }
}

const sdk = new NodeSDK({
  ...(env.DEBUG === "1"
    ? {
        spanProcessor: new SimpleSpanProcessor(
          new PatchedJaegerExporter({
            host: env.JAEGER_HOST || "localhost",
            maxPacketSize: 65000,
            port: Number(env.JAEGER_PORT || 6832),
            tags: [],
          })
        ),
      }
    : {
        traceExporter: new PatchedJaegerExporter({
          host: env.JAEGER_HOST || "localhost",
          maxPacketSize: 65000,
          port: Number(env.JAEGER_PORT || 6832),
          tags: [],
        }),
      }),
  metricExporter: new PrometheusExporter({
    endpoint: env.PROMETHEUS_ENDPOINT || "/metrics",
    port: Number(env.PROMETHEUS_PORT || 9090),
    preventServerStart: false,
  }),
  instrumentations: getNodeAutoInstrumentations(),
});

sdk.start();

process.on("SIGTERM", async () => {
  try {
    await sdk.shutdown();
  } catch (err) {
    logger.error(err);
  }
  process.exit(0);
});
