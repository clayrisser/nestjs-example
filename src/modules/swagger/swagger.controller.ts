import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
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
