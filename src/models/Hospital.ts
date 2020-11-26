import { Schema, model, Document, Model } from 'mongoose';
import { Password } from '../services';

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
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: { type: String, required: true },
        images:{type: [], required: true},
        lat: { type: String, required: false, default:"100.0"},
        lng: { type: String, required: false, default:"100.0" },
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
