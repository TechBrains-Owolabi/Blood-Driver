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
    body('firstName').trim(),
    body('lastName').trim(),
    body('phone').trim().isLength({min:11, max:11}).withMessage("Pnone number must be 11 characters"),
    body('city').trim(),
    body('state').trim(),
    body('country').trim(),
    
  ])
  @use(validateRequest)
  async postSignup(req: Request, res: Response, next: NextFunction) {
    
    const { email, password, firstName, lastName, phone, phoneType, bloodType, city, state, country, lat, lng } = req.body;
    const existingUser = await DB.Models.User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('A user with that email already exists');
    }

    let user = await DB.Models.User.create({ email, password, firstName, lastName, bloodType, phone, phoneType, city, state, country, lat, lng });

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
