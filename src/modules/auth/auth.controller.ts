import { Grant } from 'keycloak-connect';
import { KeycloakService, Public, UserInfo } from 'nestjs-keycloak';
import { Response } from 'express';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  Post,
  Query,
  Render,
  Res
} from '@nestjs/common';
import { Auth } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(private keycloakService: KeycloakService) {}

  @Public()
  @Post('login')
  async postLogin(
    @Res() res: Response,
    @Body('password') password?: string,
    @Body('refresh_token') refreshToken?: string,
    @Body('username') username?: string,
    @Query('redirect') redirect?: string
  ): Promise<Auth> {
    try {
      const result = await this.keycloakService.authenticate({
        password,
        refreshToken,
        username
      });
      if (redirect?.length) {
        res.redirect(redirect);
      } else {
        res.json(result);
      }
      return result;
    } catch (err) {
      if (err.payload && err.statusCode) {
        throw new HttpException(err.payload, err.statusCode);
      }
      throw err;
    }
  }

  @Public()
  @Get('login')
  @Render('login')
  getLogin() {
    return {};
  }

  @Public()
  @Get('logout')
  async getLogout(@Res() res: Response) {
    await this.keycloakService.logout();
    return res.status(302).redirect('/auth/login');
  }

  @Get('userinfo')
  getUserInfo(): UserInfo {
    const { userInfo } = this.keycloakService;
    if (!userInfo) throw new ForbiddenException();
    return userInfo;
  }

  @Get('grantinfo')
  getGrantInfo(): Grant {
    const { grant } = this.keycloakService;
    if (!grant) throw new ForbiddenException();
    return grant;
  }
}
