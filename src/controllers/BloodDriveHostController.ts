import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError } from '../errors';
import { validateRequest } from '../middlewares';

@controller('/drivehost')
export class BloodDriveHostController {
  @post("/")
  @bodyValidator([
    body('email').isEmail().withMessage('Email must be vaild'),
    body('firstName').trim(),
    body('lastName').trim(),
    body('phone').trim().isLength({min:11, max:11}).withMessage("Pnone number must be 11 characters"),
    body('city').trim(),
    body('state').trim(),
    body('country').trim(),
    body('incentive').trim(),
    body('additionalComment').trim(),
    
  ])
  @use(validateRequest)
  async createBloodDriveHost(req: Request, res: Response, next: NextFunction) {
    
    const { email, organization, organizationType, firstName, lastName, phone, phoneType, venue, date, city, state, country, lat, lng, incentive, additionalComment } = req.body;

    var currentDate = new Date().toDateString;
    if(date <= currentDate){
      throw new BadRequestError("Date can not be less than todays date");
    }

    let bloodDriveHost = await DB.Models.BloodDriveHost.create({ email, organization, organizationType, firstName, lastName, venue, date, phone, phoneType, city, state, country, lat, lng, incentive, additionalComment});

    res.status(HttpStatusCodes.CREATED).json(bloodDriveHost);
  }

  @get('/')
  @use(validateRequest)
  async getAllBloodDrive(req: Request, res: Response, next: NextFunction) {
    const allBloodDrive = await DB.Models.BloodDriveHost.find();
    res.status(200).json(allBloodDrive);
  }
}
