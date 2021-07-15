/**
 * File: /src/modules/swagger/swagger.controller.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 15-07-2021 01:54:12
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

import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class SwaggerController {
  @Get('oauth2-redirect.html')
  @Render('oauth2-redirect.ejs')
  oauth2Redirect(@Req() req: Request) {
    return { baseUrl: this.getBaseUrl(req) };
  }

  @Get('swagger/redirect')
  redirect(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.query.access_token;
    const baseUrl = this.getBaseUrl(req);
    // return res.json({ accessToken, baseUrl });
    return res.redirect(`${baseUrl}/api?access_token=${accessToken}`);
  }

  getBaseUrl(req: Request) {
    return `${req.get('X-Forwarded-Protocol') || req.protocol}://${
      req.get('X-Forwarded-Host') || req.get('host')
    }`;
  }
}
