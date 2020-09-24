import { HttpStatusCodes } from '../enums';
import { CustomError } from './custom-errors';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);

    this.reason = message;

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
