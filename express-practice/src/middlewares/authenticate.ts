import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { container } from '../container';

const SECRET_KEY = container.get('JwtSecretKey') as string;

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/auth/login') {
    return next();
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Token not found. Please login first.' });
  }

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
