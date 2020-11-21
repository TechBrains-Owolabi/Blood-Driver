import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get, put} from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError } from '../errors';
import { validateRequest } from '../middlewares';

@controller('/user')
export class UserController {
  @put('/:userId')
  @use(validateRequest)
  async updateMe(req: Request, res: Response, next: NextFunction) {
    
    const id = req.params.userId;

    delete(req.body.email);
    delete(req.body.password);
    console.log("Current ID: ", id);
    
    
    const existingUser = await DB.Models.User.findByIdAndUpdate(id, req.body,  {
        new: true,
        runValidators: true,
      });
    if (!existingUser) {
      throw new BadRequestError('Cannot update user that doesnt exist');
    }

    res.status(HttpStatusCodes.CREATED).json(existingUser);
  }

  @get('/:userId')
  @use(validateRequest)
  async getUser(req: Request, res: Response, next: NextFunction) {
    
    const id = req.body.userId;
    const existingUser = await DB.Models.User.findOne({ id }).populate("bloodDrives");

    if (!existingUser) {
      throw new BadRequestError('A user with that email does not exist');
    }

    res.status(HttpStatusCodes.CREATED).json(existingUser);
  }

  
}
