/**
 * File: /src/modules/auth/resolver.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 17-07-2021 05:09:05
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

import { Logger } from '@nestjs/common';
import { Resolver, Query, Ctx, ObjectType, Args } from 'type-graphql';
import { GraphqlCtx } from '~/types';
import { LoginResponseDto, LoginRequestDto } from './dto';

@Resolver((_of) => Auth)
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  @Query((_returns) => LoginResponseDto, { nullable: true })
  async queryLogin(
    @Ctx() ctx: GraphqlCtx,
    @Args() args: LoginRequestDto
  ): Promise<LoginResponseDto | null> {
    const tokens = await ctx.keycloakService?.authenticate(args);
    if (!tokens) return null;
    const userInfo = (await ctx.keycloakService?.getUserInfo())!;
    return {
      accessToken: tokens.accessToken?.token || '',
      refreshToken: tokens.refreshToken?.token || '',
      userInfo
    };
  }
}

@ObjectType({
  isAbstract: true
})
export class Auth {}
