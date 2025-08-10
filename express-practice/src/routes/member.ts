import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { MemberService } from '../services/memberService';
import { inject, injectable } from 'inversify';
import { validate } from '../middlewares/validate';

@injectable()
export class MemberRouter {
  router: Router;

  constructor(@inject(MemberService) private memberService: MemberService) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      '',
      validate([body('name').isString(), body('age').optional().isInt({ min: 0 })], ['name', 'age']),
      async (req: Request, res: Response) => {
        const { name, age } = req.body;
        await this.memberService.create({ name, age });
        return res.status(201).send();
      }
    );

    this.router.get('', async (req: Request, res: Response) => {
      const result = await this.memberService.getAll();
      res.status(200).json(result);
    });

    this.router.get('/:id', validate([param('id').isInt({ gt: -1 })]), async (req: Request, res: Response) => {
      const id = parseInt(req.params.id!, 10);
      const result = await this.memberService.getById(id);
      res.status(200).json(result);
    });

    this.router.patch(
      '/:id',
      validate(
        [param('id').isInt({ gt: -1 }), body('name').optional().isString(), body('age').optional().isInt({ min: 0 })],
        ['name', 'id']
      ),
      async (req: Request, res: Response) => {
        const id = parseInt(req.params.id!, 10);
        const { name, age } = req.body;
        await this.memberService.update({ id, name, age });
        res.status(200).send();
      }
    );

    this.router.delete('/:id', validate([param('id').isInt({ gt: -1 })]), async (req: Request, res: Response) => {
      const id = parseInt(req.params.id!, 10);
      await this.memberService.deleteById(id);
      res.status(204).send();
    });
  }
}
