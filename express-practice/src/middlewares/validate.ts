import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export function validate(validationChains: ValidationChain[], allowedFields?: string[]) {
  return [
    ...validationChains,
    (req: Request, res: Response, next: NextFunction) => {
      if (!validationResult(req).isEmpty()) {
        return res.status(400).send();
      }

      if (allowedFields) {
        const unknownFields = [...Object.keys(req.body), ...Object.keys(req.params)].filter(
          (key) => !allowedFields.includes(key)
        );
        if (unknownFields.length) {
          return res.status(400).send();
        }
      }
      next();
    },
  ];
}
