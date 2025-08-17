import { Request, Response, CookieOptions, NextFunction, Router } from 'express';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

@injectable()
export class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
      if (req.cookies.token) {
        return res.status(400).send();
      }

      // TODO: login

      const token = jwt.sign({}, 'secretKey', { expiresIn: '1h' });
      return res
        .cookie('token', token, {
          ...tokenCookieOptions,
          maxAge: 60 * 60 * 1000,
        })
        .send();
    });

    this.router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
      if (!req.cookies.token) {
        return res.status(400).send();
      }
      return res.clearCookie('token', tokenCookieOptions).send();
    });
  }
}
