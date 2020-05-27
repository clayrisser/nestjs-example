export {};

interface Session {
  sessionId?: any;
}

declare global {
  namespace Express {
    interface Request {
      session?: Session;
      destroySession?: (cb?: (err: Error) => any) => any;
    }
  }
}
