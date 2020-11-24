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
    //get all fields needed from the request body
    const { email, registrationNumber, name, phone, capacity, address, city, state, country, lat, lng, images } = req.body;

    //Create hospital. Throw error if insertion fails
    let hospital = await DB.Models.Hospital.create({ email, registrationNumber, name, capacity, address, phone, city, state, country, lat, lng, images});
    if(!hospital){
        throw new BadRequestError("Hospital details was not saved succesfully. Please try again")
    }

    //Prepare email details
    const toEmail = email
    const emailSubject = "Congratulations! We are happy to have you";
    const emailBody = `Thank you for adding your hospital to the Blood Drive portal. You will be notified when people mention your hospital to donate blood through this email\n
    Your hospital ID is ${hospital.id}. Please keep this ID safe as it will be required to if you want to update or delete hospital profile.\n
    Just to be sure, You provided the information below\n${hospital}\n\nWelcome on board.....`;
    
    //send email
    await EmailUtil.sendEmail(toEmail, emailSubject, emailBody);
    
    //return response
    res.status(HttpStatusCodes.CREATED).json({success:true});
  }
}
