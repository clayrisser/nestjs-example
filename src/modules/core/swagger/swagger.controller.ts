/**
 * File: /src/modules/core/swagger/swagger.controller.ts
 * Project: example-nestjs
 * File Created: 06-12-2021 08:30:36
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 25-10-2022 10:51:15
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2022
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

import { ConfigService } from '@nestjs/config';
import { Controller, Get, HttpException, HttpStatus, Render } from '@nestjs/common';

@Controller()
export class SwaggerController {
  constructor(private readonly config: ConfigService) {}

  @Get('oauth2-redirect.html')
  @Render('oauth2-redirect.ejs')
  oauth2Redirect() {
    if (this.config.get('SWAGGER') === '1' || this.config.get('DEBUG') === '1') {
      return {
        swaggerBasePath: this.config.get('SWAGGER_BASE_PATH') || '/swagger',
      };
    }
    throw new HttpException('Cannot GET /oauth2-redirect.html', HttpStatus.NOT_FOUND);
  }
}
