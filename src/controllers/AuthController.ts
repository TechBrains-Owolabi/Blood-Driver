import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError } from '../errors';
import { validateRequest } from '../middlewares';

@controller('/auth')
export class AuthController {
  @post('/signup')
  @bodyValidator([
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('email').isEmail().withMessage('Email must be vaild'),
  ])
  @use(validateRequest)
  async postSignup(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const existingUser = await DB.Models.User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('A user with that email already exists');
    }

    let user = await DB.Models.User.create({ email, password });

    res.status(HttpStatusCodes.CREATED).json(user);
  }

  @post('/signin')
  @bodyValidator([
    body('email').isEmail().withMessage('Email must be vaild'),
    body('password').trim(),
  ])
  @use(validateRequest)
  async postLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const existingUser = await DB.Models.User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid email or password');
    }
    const isCorrect = await existingUser.comparePassword(password);
    if (!isCorrect) {
      throw new BadRequestError('Invalid email or password');
    }

    res.status(200).json('Log in success');
  }
}
