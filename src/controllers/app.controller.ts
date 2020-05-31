import { Controller, Get, Session, Render } from '@nestjs/common';
import { PublicPath, Resource } from '@codejamninja/nest-keycloak-connect';
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
  getCount(@Session() session: SessionData): number {
    session.count = ++session.count || 0;
    return session.count;
  }
}
