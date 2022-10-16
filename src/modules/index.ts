/**
 * File: /src/modules/index.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-10-2022 06:55:39
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

import { AuthModule } from './auth';
import { PostModule } from './post';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { SwaggerModule } from './swagger';
import { UserModule } from './user';

export default [AuthModule, PostModule, PrismaModule, RedisModule, SwaggerModule, UserModule];
