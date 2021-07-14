/**
 * File: /src/bootstrap/ejs.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:19:36
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

import path from 'path';
import { HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Adapter } from '~/types';

const rootPath = path.resolve(__dirname, '../..');

export async function registerEjs(
  app: NestExpressApplication | NestFastifyApplication
) {
  const { httpAdapter } = app.get(HttpAdapterHost);
  const platformName = httpAdapter.getType();
  switch (platformName) {
    case Adapter.Express: {
      const expressApp = app as NestExpressApplication;
      expressApp.useStaticAssets(path.resolve(rootPath, 'public'));
      expressApp.setBaseViewsDir(path.resolve(rootPath, 'views'));
      expressApp.setViewEngine('ejs');
      break;
    }
    case Adapter.Fastify: {
      const ejs = await import('ejs');
      const fastifyApp = app as NestFastifyApplication;
      fastifyApp.useStaticAssets({
        root: path.join(rootPath, 'public'),
        prefix: '/public/'
      });
      fastifyApp.setViewEngine({
        engine: { handlebars: ejs },
        templates: path.join(rootPath, 'views')
      });
      break;
    }
    default: {
      throw new Error(`No support for current HttpAdapter: ${platformName}`);
    }
  }
}
