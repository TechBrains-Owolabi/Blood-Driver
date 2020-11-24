import { Schema, model, Document, Model } from 'mongoose';

declare interface IHospital extends Document {
    name: string;
    registrationNumber: string;
    capacity: number;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    lat: string;
    lng: string;
    images: Array<string>
    createdAt?: Date;
    updatedAt?: Date;
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
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: { type: String, required: true },
        images:{type: [], required: true},
        lat: { type: String, required: false, default:"100.0"},
        lng: { type: String, required: false, default:"100.0" },
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
    

    this._model = model<IHospital>('Hospital', schema);
  }

  public get model(): Model<IHospital> {
    return this._model;
  }
}
