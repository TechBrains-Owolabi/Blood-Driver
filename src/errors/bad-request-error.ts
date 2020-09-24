import { CustomError } from './custom-errors';
import { HttpStatusCodes } from '../enums';

export class BadRequestError extends CustomError {
  statusCode = HttpStatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
