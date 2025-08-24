import { Request, Response, CookieOptions, NextFunction, Router } from 'express';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { validate } from '../middlewares/validate';
import { body } from 'express-validator';
import { AccountService } from '../services/accountService';

const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

@injectable()
export class AuthRouter {
  router: Router;

  constructor(
    @inject(AccountService) private readonly accountService: AccountService,
    @inject('JwtSecretKey') private readonly jwtSecretKey: string
  ) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      '/login',
      validate([body('id').isInt(), body('password').isString()]),
      async (req: Request, res: Response, next: NextFunction) => {
        if (req.cookies.token) {
          return res.status(400).send();
        }

        await this.accountService.login(req.body);

        const token = jwt.sign({ id: req.body.id }, this.jwtSecretKey, { expiresIn: '1h' });
        return res
          .cookie('token', token, {
            ...tokenCookieOptions,
            maxAge: 60 * 60 * 1000,
          })
          .send();
      }
    );

    this.router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
      return res.clearCookie('token', tokenCookieOptions).send();
    });
  }
}
