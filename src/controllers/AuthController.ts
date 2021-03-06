import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from "jsonwebtoken"

const crypto = require("crypto");
const geocoder = require('../services/geocoder')
import { EmailUtil } from '../services';

import { DB } from '../AppDatabase';
import { controller, bodyValidator, post, get, use, put, del} from '../decorators';
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
    body('address').trim().not().isEmpty().withMessage("Address cannot be empty"),
  ])
  @use(validateRequest)
  async postSignup(req: Request, res: Response, next: NextFunction) {
    //get all fields needed from the request body
    const { email, password, firstName, lastName, phone, phoneType, bloodType, address} = req.body;

    //first check if an account with that email already exists and throw error if it does
    const existingUser = await DB.Models.User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('A user with that email already exists');
    }

    //Create user and create a session
    let user = await DB.Models.User.create({ email, password, firstName, lastName, bloodType, phone, phoneType, address});

    //Prepare email details
    const toEmail = email
    const emailSubject = "Congratulations! We are happy to have you";
    const emailBody = `Welcome on board ${firstName} ${lastName}.....\nHere's to saving the world one blood donation at a time`;
    
    //send email
    await EmailUtil.sendEmail(toEmail, emailSubject, emailBody);

    //return response
    res.status(HttpStatusCodes.CREATED).json(user);
  }

  @post('/signin')
  @bodyValidator([
    body('email').isEmail().withMessage('Email must be vaild'),
    body('password').trim().not().isEmpty().withMessage("Password cannot be empty"),
  ])
  @use(validateRequest)
  async postLogin(req: Request, res: Response, next: NextFunction) {
    //get signin credentials from request body
    const { email, password } = req.body;

    //check if email exists. throw an error if it doesnt
    const existingUser = await DB.Models.User.findOne({ email }).select("+password");
    if (!existingUser) {
      throw new BadRequestError('Invalid email or password');
    }

    //Then check if password matches the one stored in database and throw error if it doesnt
    const isCorrect = await existingUser.comparePassword(password);
    if (!isCorrect) {
      throw new BadRequestError('Invalid email or password');
    }

    //create a session for the signed in user and set the session on the request
    const userJWT = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJWT };

    //return response if any
    res.status(HttpStatusCodes.OK).json({ success: true });
  }

  @post('/signout')
  @use(currentUser)
  @use(validateRequest)
  async postSignout(req: Request, res: Response, next: NextFunction) {
    //destroy session and send response
    req.session = null;
    res.status(HttpStatusCodes.OK).json({ success: true });
  }

  @get("/me")
  @use(currentUser)
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    //get ID from session. throw error if session object doesnt exist
    const id = req.currentUser?.id;
    if(!id){
      throw new NotAuthorizedError()
    }

    //get user and return response
    const user = await DB.Models.User.findById(id).populate("bloodDrives");
    res.status(HttpStatusCodes.OK).json({ currentUser: user})
  }

  @put('/me')
  @use(validateRequest)
  @use(currentUser)
  async updateMe(req: Request, res: Response, next: NextFunction) {
    //make sure email and password fields are not sent to be updated
    delete(req.body.email);
    delete(req.body.password);
    
    //get ID from session. throw error if session object doesnt exist
    const id = req.currentUser?.id;
    if(!id){
      throw new NotAuthorizedError()
    }

    //Make sure to update geocoded address when a user updates the address. For some reason, I cant get this to work as a mongoose middleware
    if(req.body.address){
      const newAddress = await geocoder.geocode(req.body.address)
      const user = await DB.Models.User.findById(id);
      req.body.location = user?.location
      req.body.location.coordinates = [newAddress[0].latitude, newAddress[0].longitude]
      req.body.location.street = newAddress[0].streetName
      req.body.location.formattedAddress = newAddress[0].formattedAddress
      req.body.location.city = newAddress[0].city
      req.body.location.state = newAddress[0].stateCode
      req.body.location.number = newAddress[0].streetNumber
      req.body.location.zipcode = newAddress[0].zipcode
      req.body.location.country = newAddress[0].countryCode
    }

    //update user. throw error if update fails for some reason
    const updatedUser = await DB.Models.User.findByIdAndUpdate(id, req.body,  {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
    if (!updatedUser) {
      throw new BadRequestError('Cannot update problem. Possible authentication issue');
    }

    //return response
    res.status(HttpStatusCodes.UPDATED).json(updatedUser);
  }

  @del('/me')
  @use(validateRequest)
  @use(currentUser)
  async deleteMe(req: Request, res: Response, next: NextFunction) {
    //get ID from session. throw error if session object doesnt exist
    const id = req.currentUser?.id;
    if(!id){
      throw new NotAuthorizedError()
    }
    
    //delete user. throw error if delete fails for some reason
    const deletedUser = await DB.Models.User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new BadRequestError('Cannot delete problem. Possible authentication issue');
    }

    //delete session and return response
    req.session = null
    res.status(HttpStatusCodes.UPDATED).json();
  }


  @post('/forgotpassword')
  @bodyValidator([
    body('email').isEmail().withMessage('Email must be vaild'),
  ])
  @use(validateRequest)
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    // Get the email from the request body. check if user with that email exists. If not, throw error
    const { email } = req.body;
    const user = await DB.Models.User.findOne({ email });
    if (!user) {
      throw new BadRequestError("There is no user with that email");
    }

    //Create a password reset token field and save it on the user object
    const resetToken = await user.getPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Form the resetUrl from baseurl and reset token and create message to be sent to the user
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/auth/resetpassword/${resetToken}`;
    const message = `You are recieving this email because you (or someone else) has requested the reset of your password. Please make a POST request to:${resetUrl}\nThis link expires in 30 minutes`;

    //Send message to the user. Unset the resetPasswordToken field on the user object if email fails to send
    try {
      await EmailUtil.sendEmail( email, "Password reset token", message);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: "Email sent succesfully",
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new BadRequestError("Email could not be sent");
    }
  }


  @put('/resetpassword/:resettoken')
  @use(validateRequest)
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    //get the password token from the URL, hash it and try to get it from the database.Throw an error if it doesnt
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
    const user = await DB.Models.User.findOne({ 
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: new Date() } 
    })
    if (!user) {
      throw new BadRequestError("Invalid token");
    }

    //get the new password from the request body and set some fields to undefined so that the user cant use the link and token again
    //We dont need to hash the password here. The middleware in mongoose handles that already
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    //Save the use 
    await user.save();

    //create a session for the signed in user and set the session on the request
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJWT };

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "Password reset successfully. User has been signed in"
    });
  }


}


