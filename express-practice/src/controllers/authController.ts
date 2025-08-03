import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

export function login(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.token) {
    return res.status(400).send();
  }

  // login

  const token = jwt.sign({}, 'secretKey', { expiresIn: '1h' });
  return res
    .cookie('token', token, {
      ...tokenCookieOptions,
      maxAge: 60 * 60 * 1000,
    })
    .send();
}

export function logout(req: Request, res: Response, next: NextFunction) {
  return res.clearCookie('token', tokenCookieOptions).send();
}
