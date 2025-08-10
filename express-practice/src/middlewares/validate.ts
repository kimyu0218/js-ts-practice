import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export function validate(validationChains: ValidationChain[]) {
  return [
    ...validationChains,
    (req: Request, res: Response, next: NextFunction) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).send();
      }
      next();
    },
  ];
}
