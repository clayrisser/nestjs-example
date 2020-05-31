import { KeycloakService } from 'nestjs-keycloak/lib/keycloak.service';
import { PublicPath } from 'nestjs-keycloak';
import { Response, Request } from 'express';
import {
  Body,
  Query,
  Controller,
  Get,
  HttpException,
  Post,
  Render,
  Req,
  Res
} from '@nestjs/common';
import { Auth } from '../models';

@Controller()
export class AuthController {
  constructor(private keycloak: KeycloakService) {}

  @PublicPath()
  @Post('login')
  async postLogin(
    @Res() res: Response,
    @Body('password') password?: string,
    @Body('refresh_token') refreshToken?: string,
    @Body('username') username?: string,
    @Query('redirect') redirect?: string
  ): Promise<Auth> {
    try {
      const result = await this.keycloak.authenticate({
        password,
        refreshToken,
        username
      });
      redirect?.length ? res.redirect(redirect) : res.json(result);
      return result;
    } catch (err) {
      if (err.payload && err.statusCode) {
        throw new HttpException(err.payload, err.statusCode);
      }
      throw err;
    }
  }

  @PublicPath()
  @Get('login')
  @Render('login')
  getLogin() {
    return {};
  }

  @PublicPath()
  @Get('logout')
  async getLogout(@Req() req: Request, @Res() res: Response) {
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
    return res.status(302).redirect('/login');
  }
}
