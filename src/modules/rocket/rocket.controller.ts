/**
 * File: /src/modules/rockets/rocket.controller.ts
 * Project: app
 * File Created: 22-10-2022 08:45:24
 * Author: Clay Risser
 * -----
 * Last Modified: 23-10-2022 07:12:12
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
import { HttpService } from '@nestjs/axios';

@Controller('rockets')
export class RocketController {
  constructor(private readonly http: HttpService) {}

  @Get()
  async getRockets() {
    const res = await this.http.axiosRef.get('https://api.spacex.land/rest/rockets');
    return res.data;
  }
}
