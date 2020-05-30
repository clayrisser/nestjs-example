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
  Res,
  Session
} from '@nestjs/common';
import { Auth } from '../models';
import { AuthService } from '../services';
import { SessionData } from '../types';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async postLogin(
    @Res() res: Response,
    @Session() session: SessionData,
    @Body('password') password?: string,
    @Body('username') username?: string,
    @Query('redirect') redirect?: string
  ): Promise<Auth> {
    try {
      const result = await this.auth.login(username, password);
      if (result.accessToken?.length) {
        session.token = result.accessToken;
      }
      redirect?.length ? res.redirect(redirect) : res.json(result);
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
