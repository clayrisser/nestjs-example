/**
 * File: /src/types.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-01-2022 05:40:44
 * Modified By: Clay Risser <email@clayrisser.com>
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

import { GraphqlCtx as NestJSGraphqlCtx } from "nestjs-keycloak-typegraphql";
import { PrismaService } from "~/modules/prisma";

export enum Adapter {
  Express = "express",
  Fastify = "fastify",
}

export interface GraphqlCtx extends NestJSGraphqlCtx {
  prisma: PrismaService;
}

export interface HashMap<T = any> {
  [key: string]: T;
}

export type DeepMap<T = any> = HashMap<DeepMap<T> | T>;

export interface Pkg {
  description?: string;
  name: string;
  version: string;
  [key: string]: any;
}
