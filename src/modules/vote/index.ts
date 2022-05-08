/**
 * File: /src/modules/vote/index.ts
 * Project: example-nestjs
 * File Created: 02-01-2022 10:59:57
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 08-05-2022 10:38:51
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
import { VoteController } from "./vote.controller";
import VoteService from "./vote.service";

@Module({
  providers: [VoteService],
  controllers: [VoteController],
})
export default class VoteModule {}

export { VoteService };

export * from "./vote.service";
