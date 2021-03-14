import { Controller, Get, Post, Render, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('count')
export class CountController {
  @Get()
  @Render('count')
  getRoot() {
    return { count: 0 };
  }

  @Post()
  getCount(@Req() req: Request): string[] {
    return Object.keys(req);
  }
}
