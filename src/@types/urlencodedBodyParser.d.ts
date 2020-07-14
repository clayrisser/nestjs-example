declare module 'urlencoded-body-parser' {
  import { Request } from 'express';

  function urlencodedBodyParser(req: Request): any;
  export = urlencodedBodyParser;
}
