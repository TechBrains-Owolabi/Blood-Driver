import { ValidationError } from 'express-validator';
import { HttpStatusCodes } from '../enums';

import { CustomError } from './custom-errors';

export class RequestValidationError extends CustomError {
  statusCode = HttpStatusCodes.BAD_REQUEST;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
