import qs from 'qs';
import { AxiosInstance, AxiosStatic } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { AXIOS } from '../providers';
import { Auth } from '../models';

export interface LoginArgs {
  username?: string;
  password?: string;
  scope?: string;
  refreshToken?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  api: AxiosInstance;

  constructor(
    @Inject(AXIOS) readonly axios: AxiosStatic,
    private readonly config: ConfigService
  ) {
    this.api = axios.create({
      baseURL: `${this.config.get('KEYCLOAK_BASE_URL')}/auth`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  async authenticate({
    password,
    refreshToken,
    scope,
    username
  }: LoginArgs): Promise<Auth> {
    if (!scope) scope = 'openid profile ';
    try {
      let data: string;
      if (refreshToken?.length) {
        data = qs.stringify({
          client_id: this.config.get('KEYCLOAK_CLIENT_ID'),
          client_secret: this.config.get('KEYCLOAK_SECRET'),
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        });
      } else {
        data = qs.stringify({
          client_id: this.config.get('KEYCLOAK_CLIENT_ID'),
          client_secret: this.config.get('KEYCLOAK_SECRET'),
          grant_type: 'password',
          password: password,
          scope: scope,
          username: username
        });
      }
      const res = await this.api.post<LoginResponseData>(
        `/realms/${this.config.get(
          'KEYCLOAK_REALM'
        )}/protocol/openid-connect/token`,
        data
      );
      return {
        accessToken: res.data.access_token,
        expiresIn: res.data.expires_in,
        message: 'authentication successful',
        refreshExpiresIn: res.data.refresh_expires_in,
        refreshToken: res.data.refresh_token,
        scope: res.data.scope,
        tokenType: res.data.token_type
      };
    } catch (err) {
      if (err.response?.data && err.response?.status) {
        const data: LoginErrorData = err.response.data;
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

export interface LoginResponseData {
  'not-before-policy'?: number;
  access_token?: string;
  expires_in?: number;
  id_token?: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  session_state?: string;
  token_type?: string;
}

export interface LoginErrorData {
  error?: string;
  error_description?: string;
}
