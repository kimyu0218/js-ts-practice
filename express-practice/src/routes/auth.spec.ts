import express from 'express';
import request from 'supertest';
import { AuthRouter } from './auth';
import cookieParser from 'cookie-parser';

describe('AuthRouter', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', new AuthRouter().router);
  });

  describe('POST /auth/login', () => {
    it('should return 200 response', async () => {
      const actual1 = await request(app).post('/auth/login').send();
      const actual2 = Array.isArray(actual1.headers['set-cookie'])
        ? actual1.headers['set-cookie']
        : actual1.headers['set-cookie']?.split(',') || [];
      expect(actual1.status).toBe(200);
      expect(actual2.some((c: string) => c.startsWith('token='))).toBe(true);
    });

    it('should return 400 response', async () => {
      const actual = await request(app).post('/auth/login').set('Cookie', 'token=1').send();
      expect(actual.status).toBe(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 200 response', async () => {
      const actual = await request(app).post('/auth/logout').set('Cookie', 'token=1').send();
      expect(actual.status).toBe(200);
    });

    it('should return 400 response', async () => {
      const actual = await request(app).post('/auth/logout').send();
      expect(actual.status).toBe(400);
    });
  });
});
