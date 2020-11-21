import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError } from '../errors';
import { validateRequest } from '../middlewares';

@controller('/user')
export class AuthController {
  @get('/me')
  @use(validateRequest)
  async getMe(req: Request, res: Response, next: NextFunction) {
    
    const id = req.body.setUserId;
    const existingUser = await DB.Models.User.findOne({ id }).populate("bloodDrives");

    if (!existingUser) {
      throw new BadRequestError('A user with that email already exists');
    }

    res.status(HttpStatusCodes.CREATED).json(existingUser);
  }
}
