import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from "jsonwebtoken"

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, get, use, put, del } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError, NotAuthorizedError } from '../errors';
import { validateRequest, currentUser } from '../middlewares';

@controller('/auth')
export class AuthController {
  @post('/signup')
  @bodyValidator([
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters'),
    body('email').isEmail().withMessage('Email must be vaild'),
    body('firstName').trim().isLength({min:2}).withMessage("First name must be atleast 2 characters"),
    body('lastName').trim().isLength({min:2}).withMessage("Last name must be atleast 2 characters"),
    body('phone').trim().isLength({min:11, max:11}).withMessage("Pnone number must be 11 characters"),
    body('city').trim().not().isEmpty().withMessage("City cannot be empty"),
    body('state').trim().not().isEmpty().withMessage("State cannot be empty"),
    body('country').trim().not().isEmpty().withMessage("Country cannot be empty"),
  ])
  @use(validateRequest)
  async postSignup(req: Request, res: Response, next: NextFunction) {
    
    const { email, password, firstName, lastName, phone, phoneType, bloodType, city, state, country, lat, lng } = req.body;
    const existingUser = await DB.Models.User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('A user with that email already exists');
    }

    let user = await DB.Models.User.create({ email, password, firstName, lastName, bloodType, phone, phoneType, city, state, country, lat, lng });

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: process.env.JWT_EXPIRE!,
      }
    );

    req.session = { jwt: userJWT };

    res.status(HttpStatusCodes.CREATED).json(user);
  }

  @post('/signin')
  @bodyValidator([
    body('email').isEmail().withMessage('Email must be vaild'),
    body('password').trim().not().isEmpty().withMessage("Password cannot be empty"),
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

    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJWT };

    res.status(HttpStatusCodes.OK).json({ success: true });
  }

  @post('/signout')
  @use(currentUser)
  @use(validateRequest)
  async postSignout(req: Request, res: Response, next: NextFunction) {
    req.session = null;
    res.status(HttpStatusCodes.OK).json({ success: true });
  }

  @get("/me")
  @use(currentUser)
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    const id = req.currentUser?.id;
    if(!id){
      throw new NotAuthorizedError()
    }
    const user = await DB.Models.User.findById(id).populate("bloodDrives");
    res.status(HttpStatusCodes.OK).json({ currentUser: user})
  }

  @put('/me')
  @use(validateRequest)
  @use(currentUser)
  async updateMe(req: Request, res: Response, next: NextFunction) {

    delete(req.body.email);
    delete(req.body.password);
    
    const id = req.currentUser?.id;

    if(!id){
      throw new NotAuthorizedError()
    }
     
    const updatedUser = await DB.Models.User.findByIdAndUpdate(id, req.body,  {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    
    if (!updatedUser) {
      throw new BadRequestError('Cannot update problem. Possible authentication issue');
    }

    res.status(HttpStatusCodes.UPDATED).json(updatedUser);
  
  }

  @del('/me')
  @use(validateRequest)
  @use(currentUser)
  async deleteMe(req: Request, res: Response, next: NextFunction) {

    const id = req.currentUser?.id;

    if(!id){
      throw new NotAuthorizedError()
    }
    
    const deletedUser = await DB.Models.User.findByIdAndDelete(id);

    
    if (!deletedUser) {
      throw new BadRequestError('Cannot delete problem. Possible authentication issue');
    }

    req.session = null

    res.status(HttpStatusCodes.UPDATED).json();
  
  }
}
