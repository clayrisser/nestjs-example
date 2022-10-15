/**
 * File: /src/modules/auth/index.ts
 * Project: example-nestjs
 * File Created: 15-10-2022 02:05:20
 * Author: Clay Risser
 * -----
 * Last Modified: 15-10-2022 02:09:07
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

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";

@Module({
  controllers: [AuthController],
  exports: [AuthResolver],
  imports: [HttpModule],
  providers: [AuthResolver],
})
export class AuthModule {}

export * from "./auth.controller";
export * from "./auth.resolver";
