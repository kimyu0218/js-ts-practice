import express from 'express';
import request from 'supertest';
import { MemberService } from '../services/memberService';
import { container } from '../container';
import { MemberRouter } from './member';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';

describe('MemberRouter', () => {
  let app: express.Express;
  let memberService: MemberService;

  beforeAll(() => {
    memberService = container.get(MemberService);

    app = express();
    app.use(express.json());
    app.use('/members', new MemberRouter(memberService).router);
  });

  describe('POST /members', () => {
    it('should return 201 response', async () => {
      const spy = jest.spyOn(memberService, 'create').mockResolvedValue();

      const actual = await request(app).post('/members').send({ name: '홍길동' });
      expect(actual.status).toBe(201);
      expect(spy).toHaveBeenCalledWith({ name: '홍길동' });
    });

    it('should return 400 response', async () => {
      const actual = await request(app).post('/members').send();
      expect(actual.status).toBe(400);
    });
  });

  describe('GET /members', () => {
    it('should return 200 response', async () => {
      jest
        .spyOn(memberService, 'getAll')
        .mockResolvedValue([
          { id: 0, name: '홍길동', age: 10 } as Member,
          { id: 1, name: '고길동', age: 20 } as Member,
        ]);

      const actual = await request(app).get('/members').send();
      expect(actual.status).toBe(200);
      expect(actual.body).toEqual(
        expect.arrayContaining([
          { id: 0, name: '홍길동', age: 10 },
          { id: 1, name: '고길동', age: 20 },
        ])
      );
    });
  });

  describe('GET /members/:id', () => {
    it('should return 200 response', async () => {
      const spy = jest.spyOn(memberService, 'getById').mockResolvedValue({ id: 0, name: '홍길동', age: 10 } as Member);

      const actual = await request(app).get('/members/0').send();
      expect(actual.status).toBe(200);
      expect(actual.body).toEqual({ id: 0, name: '홍길동', age: 10 });
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('should return 400 response', async () => {
      const actual = await request(app).get('/members/id0').send();
      expect(actual.status).toBe(400);
    });

    it('should return 404 response', async () => {
      const spy = jest.spyOn(memberService, 'getById').mockRejectedValue(new MemberNotFoundError(0));

      const actual = await request(app).get('/members/0').send();
      expect(actual.status).toBe(404);
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('PATCH /members/:id', () => {
    it('should return 200 response', async () => {
      const spy = jest.spyOn(memberService, 'update').mockResolvedValue();

      const actual = await request(app).patch('/members/0').send({ name: '홍길동' });
      expect(actual.status).toBe(200);
      expect(spy).toHaveBeenCalledWith({ id: 0, name: '홍길동', age: undefined });
    });

    it('should return 400 response', async () => {
      const actual = await request(app).patch('/members/0').send({ unknown: true });
      expect(actual.status).toBe(400);
    });

    it('should return 404 response', async () => {
      const spy = jest.spyOn(memberService, 'update').mockRejectedValue(new MemberNotFoundError(0));

      const actual = await request(app).patch('/members/0').send({});
      expect(actual.status).toBe(404);
      expect(spy).toHaveBeenCalledWith({ id: 0, name: undefined, age: undefined });
    });
  });

  describe('DELETE /members/:id', () => {
    it('should return 204 response', async () => {
      const spy = jest.spyOn(memberService, 'deleteById').mockResolvedValue();

      const actual = await request(app).delete('/members/0').send();
      expect(actual.status).toBe(204);
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('should return 400 response', async () => {
      const actual = await request(app).delete('/members/id0').send();
      expect(actual.status).toBe(400);
    });

    it('should return 404 response', async () => {
      const spy = jest.spyOn(memberService, 'deleteById').mockRejectedValue(new MemberNotFoundError(0));

      const actual = await request(app).delete('/members/0').send({});
      expect(actual.status).toBe(404);
      expect(spy).toHaveBeenCalledWith(0);
    });
  });
});
