import { Controller, Get, Session, Render } from '@nestjs/common';
import { SessionData } from '../types';

@Controller()
export class AppController {
  constructor() {}

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
