import { Controller, Get, Session, Render } from '@nestjs/common';
import { PublicPath, Resource, Scopes, Roles } from 'nestjs-keycloak';
import { SessionData } from '../types';

@Controller()
@Resource('app')
export class AppController {
  constructor() {}

  @PublicPath()
  @Get()
  @Render('index')
  getRoot() {
    return { message: 'Hello, world!' };
  }

  @Get('/count')
  @Scopes('write')
  getCount(@Session() session: SessionData): number {
    session.count = ++session.count || 0;
    return session.count;
  }
}
