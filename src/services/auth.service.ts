import { AxiosInstance } from 'axios';
import { Injectable, Scope } from '@nestjs/common';
import { KeycloakService, LoginArgs } from 'nestjs-keycloak';
import { Auth } from '../models';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  api: AxiosInstance;

  constructor(private readonly keycloakService: KeycloakService) {}

  async authenticate({
    password,
    refreshToken,
    scope,
    username
  }: LoginArgs): Promise<Auth> {
    return this.keycloakService.authenticate({
      password,
      refreshToken,
      scope,
      username
    });
  }
}
