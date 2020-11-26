import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get, put, del } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError, NotAuthorizedError } from '../errors';
import { validateRequest, currentUser } from '../middlewares';
import { Hospital } from '../models';
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
    const { email, registrationNumber, name, phone, capacity, address, city, state, country, lat, lng, images, passKey } = req.body;

    //Create hospital. Throw error if insertion fails
    let hospital = await DB.Models.Hospital.create({ email, registrationNumber, name, capacity, address, phone, city, state, country, lat, lng, images, passKey});
    if(!hospital){
        throw new BadRequestError("Hospital details was not saved succesfully. Please try again")
    }

    //Prepare email details
    const toEmail = email
    const emailSubject = "Congratulations! We are happy to have you";
    const emailBody = `Thank you for adding your hospital to the Blood Drive portal. You will be notified when people mention your hospital to donate blood through this email\n
    Your hospital ID is ${hospital.id}.
    Your PassKey is ${passKey}(Please keep the hospital ID and PassKey safe as it will be required if you want to update or delete hospital profile.\n
    \nWelcome on board.....\nHere's to saving the world one blood donation at a time`;
    
    //send email
    await EmailUtil.sendEmail(toEmail, emailSubject, emailBody);
    
    //return response
    res.status(HttpStatusCodes.CREATED).json({success:true});
  }

  @get('/')
  @use(validateRequest)
  async getAllHospitals(req: Request, res: Response, next: NextFunction) {
    const hospitals = await DB.Models.Hospital.find();
    res.status(200).json(hospitals);
  }

  @get('/:hospitalId')
  @use(validateRequest)
  async getHospital(req: Request, res: Response, next: NextFunction) {
    //get a blooddrive host by the ID specified. return response
    const hospitalId = req.params.hospitalId;
    const hospital = await DB.Models.Hospital.findById(hospitalId);
    res.status(200).json(hospital);
  }

  @put('/:hospitalId')
  @use(validateRequest)
  @use(currentUser)
  async updateHospital(req: Request, res: Response, next: NextFunction) {
    //Get hospital ID from request params. 
    const hospitalId = req.params.hospitalId;
    const passKey = req.body.passKey;
   
    //Check to make sure that hospital exists. throw an error if it doesnt
    const hospital = await DB.Models.Hospital.findById(hospitalId);
    if(!hospital){
      throw new BadRequestError("No Hospital with ID exists")
    }
    
    //Check that this user created this hospital by matching the passwords
    if(passKey == null){
      throw new BadRequestError("Empty Pass Key supplied")
    }
    const passwordMatch = await hospital.comparePassword(passKey);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Pass Key supplied');
    }

    //Make sure user cannot change the hospitalID, email and passKey field. this field tell which user created the drive
    delete(req.body.id);
    delete(req.body.email)
    delete(req.body.passKey);
    
    //Update the hospital. Throw error if update fails
    const updatedHospital = await DB.Models.Hospital.findByIdAndUpdate(hospital, req.body,  {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    if (!updatedHospital) {
      throw new BadRequestError('Could not update Hospital.');
    }

    //Prepare email details
    const toEmail = updatedHospital.email
    const emailSubject = "UPDATE!!!";
    const emailBody = `This is to inform you of an update to your hospital data on our platform. If you didnt make this update, please reply this email immediately else just 
    ignore this email\nCheers to saving more lives`;
    
    //send email
    await EmailUtil.sendEmail(toEmail, emailSubject, emailBody);

    //send response
    res.status(HttpStatusCodes.UPDATED).json(updatedHospital); 
  }
  
  @del('/:hospitalId')
  @use(validateRequest)
  @use(currentUser)
  async deleteHospital(req: Request, res: Response, next: NextFunction) {
    //Get hospital ID from request params. 
    const hospitalId = req.params.hospitalId;
    const passKey = req.body.passKey;
   
    //Check to make sure that hospital exists. throw an error if it doesnt
    const hospital = await DB.Models.Hospital.findById(hospitalId);
    if(!hospital){
      throw new BadRequestError("No Hospital with ID exists")
    }
    
    //Check that this user created this hospital by matching the passwords
    if(passKey == null){
      throw new BadRequestError("Empty Pass Key supplied")
    }
    const passwordMatch = await hospital.comparePassword(passKey);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Pass Key supplied');
    }
    
    //Delete the hospital. Throw error if delete fails
    const deletedHospital = await DB.Models.Hospital.findByIdAndDelete(hospital);
    if (!deletedHospital) {
      throw new BadRequestError('Could not delete Hospital.');
    }

    //Prepare email details
    const toEmail = deletedHospital.email
    const emailSubject = "DELETE!!!";
    const emailBody = `This is to inform you that your hospital records have been successfully deleted. If you didnt make this update, please reply this email immediately else just 
    ignore this email\nWe are sad to see you go but we believe you wont stop saving lives`;
    
    //send email
    await EmailUtil.sendEmail(toEmail, emailSubject, emailBody);

    //send response
    res.status(HttpStatusCodes.UPDATED).json({success: true}); 
  } 
}
