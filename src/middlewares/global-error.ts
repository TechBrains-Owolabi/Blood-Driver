import { Request, Response, NextFunction } from 'express';
import { HttpStatusCodes } from '../enums';

import { CustomError } from '../errors/custom-errors';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log(err)

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
