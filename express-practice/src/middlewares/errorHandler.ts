import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  return res.status(err.status || 500).json({ message: err.message });
}
