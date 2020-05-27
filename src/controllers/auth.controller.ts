import camelCase from 'lodash/camelCase';
import { KeycloakService } from '@cenkce/nest-keycloak-connect/keycloak.service';
import { Response, Request } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Session
} from '@nestjs/common';
import { AppService } from '../services/app.service';

export interface BodyArgs {
  username: string;
  password: string;
}

export interface SessionData {
  auth?: boolean;
  token?: string;
}

@Controller()
export class AuthController {
  constructor(
    private readonly appService: AppService,
    private keycloakService: KeycloakService
  ) {}

  @Post('login')
  async postLogin(
    @Body() body: BodyArgs,
    @Session() session: SessionData,
    @Res() res: Response
  ): Promise<any> {
    let result: any;
    try {
      result = await this.keycloakService.login(body.username, body.password);
    } catch (err) {
      const errorPayload = getErrorPayload(err);
      throw new HttpException(errorPayload, errorPayload.statusCode);
    }
    if (typeof result === 'string' && result.indexOf('access_token') !== -1) {
      session.auth = true;
      session.token = result;
      res.status(302).redirect('/notifications/direct');
    }
  }

  @Get('logout')
  async getLogout(@Res() res: Response, @Req() req: Request) {
    if (!req.session?.sessionId) return res.json({});
    try {
      await new Promise((resolve, reject) => {
        req.destroySession((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
      return res.status(302).redirect('/login');
    } catch (err) {
      const errorPayload = getErrorPayload(err);
      throw new HttpException(errorPayload, errorPayload.statusCode);
    }
  }
}

export interface HashMap {
  [key: number]: any;
  [key: string]: any;
}

function normalizeKeys(
  hashMap: HashMap,
  normalizer: (key: string | number) => string | number = camelCase,
  depth = 1
): HashMap {
  return Object.entries(hashMap).reduce(
    (payload: HashMap, [key, value]: [string, any]) => {
      const normalizedKey = normalizer(key);
      if (typeof value === 'object' && !Array.isArray(value) && depth) {
        payload[normalizedKey] = normalizeKeys(value, normalizer, --depth);
      } else {
        payload[normalizedKey] = value;
      }
      return payload;
    },
    {}
  );
}

interface ErrorPayload {
  statusCode: number;
  [key: string]: any;
}

function getErrorPayload(err: any): ErrorPayload {
  let payload: ErrorPayload;
  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) throw err;
  try {
    payload = {
      ...normalizeKeys(
        JSON.parse(JSON.parse(err.message.substr(6, err.message.length)))
      ),
      statusCode
    };
  } catch (err) {
    payload = { message: err.message, statusCode };
  }
  return payload;
}
