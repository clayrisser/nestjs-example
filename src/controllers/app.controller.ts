import { Controller, Get, Param, Session, Render } from '@nestjs/common';
import { Scopes, Resource } from '@cenkce/nest-keycloak-connect';
import { AppService } from '../services/app.service';
import { SessionData } from '../types';

@Controller()
@Resource('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getRoot() {
    return { message: 'Hello, world!' };
  }

  @Scopes('coolz')
  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }

  @Get('/count')
  getCount(@Session() session: SessionData): number {
    session.count = ++session.count || 0;
    return session.count;
  }
}
