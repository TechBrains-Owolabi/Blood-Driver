import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get, put, del } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError, NotAuthorizedError } from '../errors';
import { validateRequest, currentUser } from '../middlewares';
var nodemailer = require('nodemailer'); 

@controller('/hospital')
export class HospitalController {
  @post("/")
  @bodyValidator([
    body('email').isEmail().withMessage('Email must be vaild'),
    body('registrationNumber').trim(),
    body('name').trim(),
    body('capacity').trim().isLength({min:1}).withMessage("Center's capacity cannot be less that 1"),
    body('phone').trim().isLength({min:11, max:11}).withMessage("Pnone number must be 11 characters"),
    body('address').trim(),
    body('city').trim(),
    body('state').trim(),
    body('country').trim(),
    body('images').trim().isLength({min:1}).withMessage("Please provide at least one image of the venue"),  
  ])
  @use(validateRequest)
  async createBloodDriveHost(req: Request, res: Response, next: NextFunction) {
    const { email, registrationNumber, name, phone, capacity, address, city, state, country, lat, lng, images } = req.body;
    let hospital = await DB.Models.Hospital.create({ email, registrationNumber, name, capacity, address, phone, city, state, country, lat, lng, images});
    res.status(HttpStatusCodes.CREATED).json(hospital);
  }
}
