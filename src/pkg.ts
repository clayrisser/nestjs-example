/**
 * File: /src/pkg.ts
 * Project: example-nestjs
 * File Created: 24-07-2021 05:33:13
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 24-07-2021 05:35:04
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
import fs from 'fs-extra';

const rootPath = path.resolve(__dirname, '..');

const pkg: Pkg = fs.readJSONSync(path.resolve(rootPath, 'package.json'));

export interface Pkg {
  name: string;
  version: string;
  [key: string]: any;
}

export default pkg;