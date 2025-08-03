import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?: string | JwtPayload;
  }
}

declare global {
  interface Error {
    status?: number;
  }
}

export {};
