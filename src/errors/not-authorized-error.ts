import { HttpStatusCodes } from '../enums';
import { CustomError } from './custom-errors';

export class NotAuthorizedError extends CustomError {
  statusCode = HttpStatusCodes.UNAUTHORIZED;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
