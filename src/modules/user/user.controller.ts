/**
 * File: /src/modules/user/user.controller.ts
 * Project: app
 * File Created: 20-10-2022 01:37:19
 * Author: Clay Risser
 * -----
 * Last Modified: 21-10-2022 14:52:27
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

import { Controller, Get } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Span } from 'nestjs-otel';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private readonly logger: Logger, private readonly http: HttpService) {}

  @Get()
  @Span('get user')
  async getUser() {
    await firstValueFrom(this.http.get('https://google.com'));
    this.logger.log('YAY');
    return { hello: 'world' };
  }
}
