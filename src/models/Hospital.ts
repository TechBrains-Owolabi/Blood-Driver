import { Schema, model, Document, Model } from 'mongoose';
import { Password } from '../services';
const geocoder = require('../services/geocoder')

declare interface IHospital extends Document {
    name: string;
    registrationNumber: string;
    capacity: number;
    email: string;
    phone: string;
    address: string;
    location?: Object;
    passKey: string;
    images: Array<string>
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword: (password: string) => boolean;
}
  
export interface HospitalModel extends Model<IHospital> {}

export class Hospital {
  private _model: Model<IHospital>;

  constructor() {
    const schema = new Schema(
      {
        name: {type: String, required: true},
        registrationNumber:{type: String, required: true, unique: true},
        capacity:{type: Number, required: true},
        email:{type: String, required: [true, "Please provide an email"],  unique: [true, "The email provided is already associated with another hospital"]},
        phone: { type: String, required: [true, "Please provide a phone number"] },
        address:{type: String, required: [true, "Please provide an address"] },
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
          state: String,
          zipcode: String,
          country: String
        },
        images:{type: [String], required: true},
        passKey:{type: String, required: [true, "Please provide a pass key. This key will be required for updating or deleting this hospital"] },
      },
      {
        toJSON: {
          transform(doc, ret) {
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
            delete ret.passKey;
          },
        },
        timestamps: true,
      }
    );
    
    schema.pre('save', async function (done) {
      if(this.isModified('address')){
        const loc = await geocoder.geocode(this.get('address'));
        this.set('location', {
          type: 'Point',
          coordinates: [loc[0].latitude, loc[0].longitude],
          formattedAddress: loc[0].formattedAddress,
          street: loc[0].streetName,
          city: loc[0].city,
          state: loc[0].stateCode,
          zipcode: loc[0].zipcode,
          country: loc[0].countryCode,
        })
      }
      
      if (this.isModified('passKey')) {
        const hashed = await Password.toHash(this.get('passKey'));
        this.set('passKey', hashed);
      }
      done();
    });

    schema.methods.comparePassword = async function (
      passKey: string
    ): Promise<boolean> {
      return await Password.compare(this.passKey, passKey);
    };

    this._model = model<IHospital>('Hospital', schema);
  }

  public get model(): Model<IHospital> {
    return this._model;
  }
}
