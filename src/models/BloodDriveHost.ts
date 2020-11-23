import { Schema, model, Document, Model, Mongoose } from 'mongoose';
const mongoose = require('mongoose')

declare interface IBloodDriveHost extends Document {
    firstName: string;
    lastName: string;
    organizationType: string
    organization: string
    email: string;
    phoneType: string;
    phone: string;
    venue: string;
    date: Date;
    city: string;
    state: string;
    country: string;
    incentive: string;
    additionalComment: string;
    lat: string;
    lng: string;
    user: string;
    createdAt?: Date;
    updatedAt?: Date;
}
  
export interface BloodDriveHostModel extends Model<IBloodDriveHost> {}

export class BloodDriveHost {
  private _model: Model<IBloodDriveHost>;

  constructor() {
    const schema = new Schema(
      {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email:{type: String, required: true},
        organizationType: {type: String, enum: ["Business", "Religious", "Civic/Community", "Government", "Education", "Healthcare", "Other"], default: "Other"},
        organization: {type: String, required: true},
        phoneType:{type: String, enum: ["work", "home", "mobile"], default: "mobile"},
        phone: { type: String, required: true },
        venue:{type: String, required: true },
        date:{type: Date, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: { type: String, required: true },
        incentive: {type: String, default: "None"},
        additionalComment: {type: String, required: true},
        lat: { type: String, required: false, default:"100.0"},
        lng: { type: String, required: false, default:"100.0" },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        toJSON: {
          transform(doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
          },
        },
        timestamps: true,
      }
    );
    

    this._model = model<IBloodDriveHost>('BloodDriveHost', schema);
  }

  public get model(): Model<IBloodDriveHost> {
    return this._model;
  }
}
