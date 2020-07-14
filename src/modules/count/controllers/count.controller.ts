import { Controller, Get, Session, Render, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public, Resource /* Roles */ } from 'nestjs-keycloak';
import { SessionData } from '../../../types';

@Controller()
@Resource('app')
export class CountController {
  constructor() {}

  @Get()
  @Public()
  @Render('index')
  getRoot() {
    return { message: 'Hello, world!' };
  }

  // @Roles('admin')
  @Get('/count')
  getCount(@Req() req: Request, @Session() session: SessionData): number {
    // @ts-ignore
    console.log(req.grant);
    session.count = ++session.count || 0;
    return session.count;
  }
}
