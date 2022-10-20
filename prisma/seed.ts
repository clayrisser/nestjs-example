/**
 * File: /seed.ts
 * Project: example-graphback-nestjs
 * File Created: 14-07-2021 12:40:10
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 20-10-2022 03:11:12
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021
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

import { seedDb } from '@risserlabs/prisma-scripts';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default async function seed() {
  await seedDb({}, []);
}
