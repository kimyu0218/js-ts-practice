import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/login') {
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
