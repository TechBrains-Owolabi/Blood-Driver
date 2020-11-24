import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, use, get, put, del } from '../decorators';
import { HttpStatusCodes } from '../enums';
import { BadRequestError, NotAuthorizedError } from '../errors';
import { validateRequest, currentUser } from '../middlewares';

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
  @use(currentUser)
  async createBloodDriveHost(req: Request, res: Response, next: NextFunction) {
    //get ID from session. throw error if session object doesnt exist
    const id = req.currentUser?.id;
    if(!id){
      throw new NotAuthorizedError()
    }
    
    //get all fields needed from the request body. set the user field to the ID above
    const { email, organization, organizationType, firstName, lastName, phone, phoneType, venue, date, city, state, country, lat, lng, incentive, additionalComment } = req.body;
    const user = id;

    //get current date and check to make sure blood drive host is not backdated. throw error if it is
    var currentDate = new Date().toDateString();
    if(date < currentDate){
      throw new BadRequestError("Date can not be less than todays date");
    }

    //create blooddrivehost and send response
    let bloodDriveHost = await DB.Models.BloodDriveHost.create({ email, organization, organizationType, firstName, lastName, venue, date, phone, phoneType, city, state, country, lat, lng, incentive, additionalComment, user});
    res.status(HttpStatusCodes.CREATED).json(bloodDriveHost);
  }

  @get('/')
  @use(validateRequest)
  @use(currentUser)
  async getAllBloodDrive(req: Request, res: Response, next: NextFunction) {
    //get ID from session. throw error if session object doesnt exist
    const user = req.currentUser?.id;
    if(!user){
      throw new NotAuthorizedError()
    }

    //get all blood drive host for logged in user and return response
    const allBloodDrive = await DB.Models.BloodDriveHost.find({user});
    res.status(200).json(allBloodDrive);
  }

  @get('/:driveId')
  @use(validateRequest)
  async getBloodDrive(req: Request, res: Response, next: NextFunction) {
    //get a blooddrive host by the ID specified. return response
    const driveId = req.params.driveId;
    const bloodDrive = await DB.Models.BloodDriveHost.findById(driveId);
    res.status(200).json(bloodDrive);
  }

  @put('/:driveId')
  @use(validateRequest)
  @use(currentUser)
  async updateBloodDriveHost(req: Request, res: Response, next: NextFunction) {
    //get ID from session. get blooddrivehost ID from request params. throw error if session object doesnt exist 
    const userId = req.currentUser?.id;
    const driveId = req.params.driveId;
    if(!userId){
      throw new NotAuthorizedError()
    }

    //Check to make sure that blood drive host exists. throw an error if it doesnt
    const drive = await DB.Models.BloodDriveHost.findById(driveId);
    if(!drive){
      throw new BadRequestError("No Blood Drive found with ID")
    }
    
    //Check that this user created this blood drive
    if(userId != drive.user){
      throw new NotAuthorizedError()
    }

    //Make sure user cannot change the userID field. this field tell which user created the drive
    delete(req.body.user);
    
    //Update the blood drive. Throw error if update fails
    const updatedDrive = await DB.Models.BloodDriveHost.findByIdAndUpdate(driveId, req.body,  {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    if (!updatedDrive) {
      throw new BadRequestError('Could not update Blood Drive.');
    }

    //send response
    res.status(HttpStatusCodes.UPDATED).json(updatedDrive); 
  } 

  @del('/:driveId')
  @use(validateRequest)
  @use(currentUser)
  async deleteBloodDriveHost(req: Request, res: Response, next: NextFunction) {
    //get ID from session. get blooddrivehost ID from request params. throw error if session object doesnt exist 
    const userId = req.currentUser?.id;
    const driveId = req.params.driveId;
    if(!userId){
      throw new NotAuthorizedError()
    }

    //Check to make sure that blood drive host exists. throw an error if it doesnt
    const drive = await DB.Models.BloodDriveHost.findById(driveId);
    if(!drive){
      throw new BadRequestError("No Blood Drive found with ID")
    }
    
    //Check that this user created this blood drive
    if(userId != drive.user){
      throw new NotAuthorizedError()
    }

    //Delete the blood drive. Throw error if delete fails
    const deletedDrive = await DB.Models.BloodDriveHost.findByIdAndDelete(driveId);
    if (!deletedDrive) {
      throw new BadRequestError('Could not delete Blood Drive.');
    }

    // send response
    res.status(HttpStatusCodes.UPDATED).json(); 
  } 
}
