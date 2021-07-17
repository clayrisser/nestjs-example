/**
 * File: /src/modules/auth/controller.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 17-07-2021 02:36:28
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

import { ApiBody } from '@nestjs/swagger';
import { KeycloakService } from 'nestjs-keycloak';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import {
  Logger,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Body
} from '@nestjs/common';
import { LoginResponseDto } from './dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly httpService: HttpService
  ) {}

  @Get()
  @Render('count')
  getRoot() {
    return { count: 0 };
  }

  @Post('login')
  @ApiBody({ type: PostLoginBody })
  async postLogin(
    @Body() body: PostLoginBody
  ): Promise<LoginResponseDto | null> {
    const tokens = await this.keycloakService.authenticate(body);
    if (!tokens) return null;
    const userInfo = await this.keycloakService.getUserInfo();
    return {
      accessToken: tokens.accessToken?.token || '',
      refreshToken: tokens.refreshToken?.token || '',
      userInfo
    };
  }

  @Post()
  getCount(@Req() req: Request): string[] {
    return Object.keys(req);
  }
}

export class PostLoginBody {
  password?: string;
  scope?: string | string[];
  username?: string;
}
