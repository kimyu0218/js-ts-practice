import 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatusCode } from './http';

declare module 'express' {
  interface Request {
    user?: string | JwtPayload;
  }

  interface Response {
    status(code: HttpStatusCode): this;
  }
}

declare global {
  interface Error {
    status?: HttpStatusCode;
  }
}

export {};
