/**
 * File: /src/modules/auth/dto.ts
 * Project: example-nestjs
 * File Created: 17-07-2021 02:25:57
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 18-07-2021 09:29:15
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

import { ApiProperty } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType } from 'type-graphql';
import { UserInfo } from 'nestjs-keycloak-typegraphql';

@ArgsType()
export class LoginRequestDto {
  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  password?: string;

  @ApiProperty()
  @Field((_type) => [String], { nullable: true })
  scope?: string[];

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  username?: string;
}

@ObjectType()
export class LoginResponseDto {
  @ApiProperty()
  @Field((_type) => String)
  accessToken!: string;

  @ApiProperty()
  @Field((_type) => String)
  refreshToken!: string;

  @ApiProperty()
  @Field((_type) => UserInfo)
  userInfo!: UserInfo;
}

export class GrantResponseDto {}
