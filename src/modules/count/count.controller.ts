import { Controller, Get, Session, Render, Req } from '@nestjs/common';
import { Public, Resource, Roles, Scopes } from 'nestjs-keycloak';
import { Request } from 'express';
import { SessionData } from '~/types';

@Resource('count')
@Controller('count')
export class CountController {
  @Get()
  @Public()
  @Scopes('hello', 'world', 'yip', 'yap')
  @Render('index')
  getRoot() {
    return { message: 'Hello, world!' };
  }

  @Roles('admin')
  @Get('/count')
  getCount(@Req() _req: Request, @Session() session: SessionData): number {
    session.count = ++session.count || 0;
    return session.count;
  }
}
