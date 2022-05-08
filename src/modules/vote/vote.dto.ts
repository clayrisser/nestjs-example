/**
 * File: /src/modules/vote/vote.dto.ts
 * Project: example-nestjs
 * File Created: 08-05-2022 10:33:57
 * Author: Clay Risser
 * -----
 * Last Modified: 08-05-2022 10:55:33
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

import { ApiProperty } from "@nestjs/swagger";
import { ArgsType, Field, ObjectType } from "type-graphql";
import { Vote } from "~/generated/type-graphql";

@ArgsType()
export class CastRequestDto {
  @ApiProperty()
  @Field((_type) => String, { nullable: false })
  globalId!: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: false })
  address!: string;

  @ApiProperty()
  // @Field((_type) => String, { nullable: true })
  nfts!: string[];
}

@ObjectType()
export class CastResponseDto extends Vote {}
