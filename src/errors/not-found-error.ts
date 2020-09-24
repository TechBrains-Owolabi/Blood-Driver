import { HttpStatusCodes } from '../enums';
import { CustomError } from './custom-errors';

export class NotFoundError extends CustomError {
  statusCode = HttpStatusCodes.NOT_FOUND;

  constructor() {
    super('Routes not found!!!');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not found' }];
  }
}
