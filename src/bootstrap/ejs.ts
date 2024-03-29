/**
 * File: /src/bootstrap/ejs.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-10-2022 09:39:19
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2022
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
import { NestExpressApplication } from '@nestjs/platform-express';

export async function registerEjs(app: NestExpressApplication) {
  app.useStaticAssets(path.resolve(process.cwd(), 'public'));
  app.setBaseViewsDir(path.resolve(process.cwd(), 'views'));
  app.setViewEngine('ejs');
}
