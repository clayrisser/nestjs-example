/**
 * File: /src/modules/keycloak/keycloak.middleware.ts
 * Project: example-graphback-nestjs
 * File Created: 24-06-2021 04:03:49
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 14-07-2021 12:35:57
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

import Token from 'keycloak-connect/middleware/auth-utils/token';
import axios from 'axios';
import qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { Grant, Keycloak } from 'keycloak-connect';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HashMap } from '~/types';
import { KEYCLOAK } from './keycloak.provider';

@Injectable()
export default class KeycloakMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    @Inject(KEYCLOAK) private keycloak: Keycloak
  ) {}

  private logger = console;

  async use(req: Request, _res: Response, next: NextFunction) {
    const request = req as Request & { kauth: Kauth };
    try {
      const accessToken = await this.getAccessToken(req);
      if (!accessToken) return next();
      const grant = await this.keycloak.grantManager.createGrant({
        // access_token is actually a string but due to a bug in keycloak-connect we pretend it is a Token
        access_token: accessToken.token as unknown as Token
      });
      if (!request.kauth) request.kauth = {};
      request.kauth.grant = grant;
      return next();
    } catch (err) {
      return next(err);
    }
  }

  getRefreshToken(req: Request & { session?: HashMap }): string {
    return req.session?.refreshToken || null;
  }

  async getAccessToken(
    req: Request & { session?: HashMap }
  ): Promise<Token | null> {
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID') as string;
    if (!clientId) throw new Error('KEYCLOAK_CLIENT_ID not set');
    const accessToken =
      this.extractBearerToken(req) ||
      req.session?.accessToken ||
      req.session?.token;
    let token: Token | null = null;
    if (accessToken) {
      token = new Token(accessToken, clientId);
    }
    if (!token || token.isExpired()) {
      const refreshToken = this.getRefreshToken(req);
      if (refreshToken) {
        try {
          const refreshTokenGrant = await this.refreshTokenGrant(refreshToken);
          if (req.session) {
            if (refreshTokenGrant.refreshToken) {
              req.session.refreshToken = refreshTokenGrant.refreshToken;
            }
            if (refreshTokenGrant.accessToken) {
              req.session.token = refreshTokenGrant.accessToken;
            }
          }
          if (refreshTokenGrant.accessToken) {
            token = new Token(refreshTokenGrant.accessToken, clientId);
          }
        } catch (err) {
          if (err.statusCode && err.statusCode < 500) {
            const message = err.message || err.payload?.message;
            this.logger.error(
              `${err.statusCode}:`,
              ...[message ? [message] : []],
              ...[err.payload ? [JSON.stringify(err.payload)] : []]
            );
            return null;
          }
          throw err;
        }
      }
    }
    return token;
  }

  extractBearerToken(req: Request): string | null {
    const { authorization } = req.headers;
    if (typeof authorization === 'undefined') return null;
    if (authorization?.indexOf(' ') <= -1) return authorization;
    const auth = authorization?.split(' ');
    if (auth && auth[0] && auth[0].toLowerCase() === 'bearer') return auth[1];
    return null;
  }

  async refreshTokenGrant(refreshToken: string): Promise<RefreshTokenGrant> {
    const clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
    const data = qs.stringify({
      ...(clientSecret ? { client_secret: clientSecret } : {}),
      client_id: this.configService.get('KEYCLOAK_CLIENT_ID'),
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    try {
      const res = await axios.post(
        `/auth/realms/${this.configService.get(
          'KEYCLOAK_REALM'
        )}/protocol/openid-connect/token`,
        data,
        {
          baseURL: this.configService.get('KEYCLOAK_BASE_URL'),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { access_token, refresh_token } = res.data;
      return {
        ...(access_token ? { accessToken: access_token } : {}),
        ...(refresh_token ? { refreshToken: refresh_token } : {})
      };
    } catch (err) {
      if (err.response?.data && err.response?.status) {
        const { data } = err.response;
        err.statusCode = err.response.status;
        err.payload = {
          error: data.error,
          message: data.error_description,
          statusCode: err.statusCode
        };
      }
      throw err;
    }
  }
}

export interface RefreshTokenGrant {
  accessToken?: string;
  refreshToken?: string;
}

export interface Kauth {
  grant?: Grant;
}
