/**
 * File: /src/modules/auth/auth.resolver.ts
 * Project: example-nestjs
 * File Created: 15-10-2022 02:08:05
 * Author: Clay Risser
 * -----
 * Last Modified: 16-10-2022 06:51:05
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

import { Authorized, Resource } from '@risserlabs/nestjs-keycloak';
import { Logger } from '@nestjs/common';
import { Query, Ctx, ObjectType, Args } from 'type-graphql';
import { GrantProperties, Resolver, UserInfo } from '@risserlabs/nestjs-keycloak-typegraphql';
import { GraphqlCtx } from 'app/types';
import { LoginResponseDto, LoginRequestDto } from './auth.dto';

@Resource('auth')
@Resolver((_of) => Auth)
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  @Query((_returns) => LoginResponseDto, { nullable: true })
  async login(@Ctx() ctx: GraphqlCtx, @Args() args: LoginRequestDto): Promise<LoginResponseDto | null> {
    const tokens = await ctx.keycloakService?.passwordGrant(args);
    if (!tokens) return null;
    const userInfo = (await ctx.keycloakService?.getUserInfo())!;
    return {
      accessToken: tokens.accessToken?.token || '',
      refreshToken: tokens.refreshToken?.token || '',
      userInfo,
    };
  }

  @Authorized()
  @Query((_returns) => GrantProperties, { nullable: true })
  async grant(@Ctx() ctx: GraphqlCtx): Promise<GrantProperties | null> {
    return ((await ctx.keycloakService?.getGrant()) as GrantProperties) || null;
  }

  @Authorized()
  @Query((_returns) => UserInfo, { nullable: true })
  async userinfo(@Ctx() ctx: GraphqlCtx): Promise<UserInfo | null> {
    return (await ctx.keycloakService?.getUserInfo()) || null;
  }

  @Authorized()
  @Query((_returns) => [String])
  async roles(@Ctx() ctx: GraphqlCtx): Promise<string[]> {
    return (await ctx.keycloakService?.getRoles()) || [];
  }

  @Authorized()
  @Query((_returns) => [String])
  async scopes(@Ctx() ctx: GraphqlCtx): Promise<string[]> {
    return (await ctx.keycloakService?.getScopes()) || [];
  }

  @Authorized()
  @Query((_returns) => String, { nullable: true })
  async userId(@Ctx() ctx: GraphqlCtx): Promise<string | null> {
    return (await ctx.keycloakService?.getUserId()) || null;
  }

  @Authorized()
  @Query((_returns) => String, { nullable: true })
  async username(@Ctx() ctx: GraphqlCtx): Promise<string | null> {
    return (await ctx.keycloakService?.getUsername()) || null;
  }
}

@ObjectType({
  isAbstract: true,
})
export class Auth {}
