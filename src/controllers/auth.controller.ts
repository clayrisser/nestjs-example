import { Response, Request } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Render,
  Req,
  Res,
  Session
} from '@nestjs/common';
import { KeycloakService, LoginResult } from '../services/keycloak.service';
import { SessionData } from '../types';

@Controller()
export class AuthController {
  constructor(private keycloakService: KeycloakService) {}

  @Post('login')
  async postLogin(
    @Body('username') username: string,
    @Body('password') password: string,
    @Session() session: SessionData
  ): Promise<LoginResult> {
    try {
      const result = await this.keycloakService.login(username, password);
      if (result.accessToken?.length) {
        session.token = result.accessToken;
      }
      return result;
    } catch (err) {
      if (err.payload && err.statusCode) {
        throw new HttpException(err.payload, err.statusCode);
      }
      throw err;
    }
  }

  @Get('login')
  @Render('login')
  getLogin() {
    return {};
  }

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
