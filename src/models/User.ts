import { Password } from '../services';
const geocoder = require('../services/geocoder')
const crypto = require("crypto");

import { Schema, model, Document, Model } from 'mongoose';

declare interface IUser extends Document {
  email: string;
  password: string;
  resetPasswordToken?: String,
  resetPasswordExpire?: Date,
  firstName: string;
  lastName: string;
  bloodType: string;
  phone: string;
  phoneType: string;
  address: string;
  location?: Object
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword: (password: string) => boolean;
  getPasswordResetToken: () => string;
}

export interface UserModel extends Model<IUser> {}

export class User {
  private _model: Model<IUser>;

  constructor() {
    const schema = new Schema(
      {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        bloodType: { type: String, enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"], default: "O+",},
        phone: { type: String, required: true, maxlength: [11, "Phone cannot be more than 11 characters"],
        minlength: [11, "Phone cannot be less than 11 characters"],},
        phoneType:{type: String, enum: ["work", "home", "mobile"], default: "mobile",},
        address: {type: String, required: true},
        location:{
          //GeoJSON Point
          type:{
            type: String,
            enum: ['Point'],
            required: false,
          },
            coordinates: {
            type:[Number], 
            required: false,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          number: String,
          zipcode: String,
          country: String
        },
        email: { type: String, required: true, unique: [true, "Duplicate email in records"]},
        password: { type: String, required: true },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
      },
      {
        toJSON: {
          virtuals: true,
          transform(doc, ret) {
            ret.id = ret._id;
            delete ret.password;
            delete ret.__v;
            delete ret._id;
          },
        },
        timestamps: true,
      }
    );

    schema.pre('save', async function (done) {
      if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
      }
      done();
    });

    schema.pre('save', async function (done) {
      const loc = await geocoder.geocode(this.get('address'));
      this.set('location', {
        type: 'Point',
        coordinates: [loc[0].latitude, loc[0].longitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        number: loc[0].streetNumber,
        country: loc[0].countryCode,
      })
      done();
    });

    //Compare passwords
    schema.methods.comparePassword = async function (
      password: string
    ): Promise<boolean> {
      return await Password.compare(this.password, password);
    };

    // Generate and hash password reset token
    schema.methods.getPasswordResetToken = async function () {
      const resetToken = crypto.randomBytes(20).toString("hex");
      this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
        //Make reset token expire in 30 minutes
      this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
      return resetToken;
    };

    //Reverse Populate with virtuals
    schema.virtual("bloodDrives", {
      ref: "BloodDriveHost",
      localField: "_id",
      foreignField: "user",
      justone: false,
    });

    // Cascade delete blood drive hosts when a user is deleted
    // schema.pre("remove", async function (next) {
    //   await this.model("BloodDriveHost").deleteMany({ user: this._id });
    //   next();
    // });

    this._model = model<IUser>('User', schema);
  }

  public get model(): Model<IUser> {
    return this._model;
  }
}
