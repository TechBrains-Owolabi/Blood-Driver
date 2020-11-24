import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get, put, del } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError, NotAuthorizedError } from '../errors';
import { validateRequest, currentUser } from '../middlewares';
import { EmailUtil } from '../services';

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
    if(!hospital){
        throw new BadRequestError("Hospital details was not saved succesfully. Please try again")
    }
    const toEmail = email
    const emailSubject = "Test test";
    const emailBody = "Thank you for adding your hospital to the Blood Drive portal. You will be notified when people mention your hospital to donate blood through this email"
    console.log("To Email: " + toEmail);
    console.log("Subject: " + emailSubject);
    console.log("Body: " + emailBody);
    
    await EmailUtil.sendEmail(toEmail, emailSubject, emailBody);
    
    res.status(HttpStatusCodes.CREATED).json({success:true});
  }
}
