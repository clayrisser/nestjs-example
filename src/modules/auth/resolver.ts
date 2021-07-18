/**
 * File: /src/modules/auth/resolver.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 18-07-2021 10:14:52
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
import {
  Resolver,
  Query,
  Ctx,
  ObjectType,
  Args,
  Authorized
} from 'type-graphql';
import {
  Resource,
  GrantProperties,
  UserInfo
} from 'nestjs-keycloak-typegraphql';
import { GraphqlCtx } from '~/types';
import { LoginResponseDto, LoginRequestDto } from './dto';

@Resource('auth')
@Resolver((_of) => Auth)
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  @Query((_returns) => LoginResponseDto, { nullable: true })
  async login(
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

  @Query((_returns) => GrantProperties, { nullable: true })
  async grant(@Ctx() ctx: GraphqlCtx): Promise<GrantProperties | null> {
    return ((await ctx.keycloakService?.getGrant()) as GrantProperties) || null;
  }

  @Query((_returns) => UserInfo, { nullable: true })
  async userinfo(@Ctx() ctx: GraphqlCtx): Promise<UserInfo | null> {
    return (await ctx.keycloakService?.getUserInfo()) || null;
  }

  @Query((_returns) => [String])
  async roles(@Ctx() ctx: GraphqlCtx): Promise<string[]> {
    return (await ctx.keycloakService?.getRoles()) || [];
  }

  @Query((_returns) => [String])
  async scopes(@Ctx() ctx: GraphqlCtx): Promise<string[]> {
    return (await ctx.keycloakService?.getScopes()) || [];
  }

  @Query((_returns) => String, { nullable: true })
  async userId(@Ctx() ctx: GraphqlCtx): Promise<string | null> {
    return (await ctx.keycloakService?.getUserId()) || null;
  }

  @Authorized([])
  @Query((_returns) => String, { nullable: true })
  async username(@Ctx() ctx: GraphqlCtx): Promise<string | null> {
    return (await ctx.keycloakService?.getUsername()) || null;
  }
}

@ObjectType({
  isAbstract: true
})
export class Auth {}
