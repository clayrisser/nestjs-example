import { Controller, Get, Param } from '@nestjs/common';
import { KeycloakService } from '@cenkce/nest-keycloak-connect/keycloak.service';
import { Scopes, Resource } from '@cenkce/nest-keycloak-connect';
import { AppService } from '../services/app.service';

@Controller()
@Resource('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly keycloakService: KeycloakService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Scopes('coolz')
  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }
}
