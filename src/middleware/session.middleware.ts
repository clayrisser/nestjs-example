import expressSession from 'express-session';
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  PASSPORT_SESSION_OPTIONS,
  PassportSessionOptions
} from '../passportSession.module';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    @Inject(PASSPORT_SESSION_OPTIONS)
    private readonly options: PassportSessionOptions
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    expressSession(this.options.session)(req, res, next);
  }
}
