import { Password } from '../services';

import { Schema, model, Document, Model } from 'mongoose';

declare interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bloodType: string;
  phone: string;
  phoneType: string;
  city: string;
  state: string;
  country: string;
  lat: string;
  lng: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword: (password: string) => boolean;
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
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: { type: String, required: true },
        lat: { type: String, required: false, default:"100.0"},
        lng: { type: String, required: false, default:"100.0" },
        email: { type: String, required: true, unique: [true, "Duplicate email in records"]},
        password: { type: String, required: true },
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

    schema.methods.comparePassword = async function (
      password: string
    ): Promise<boolean> {
      return await Password.compare(this.password, password);
    };

    //Reverse Populate with virtuals
    schema.virtual("bloodDrives", {
      ref: "BloodDriveHost",
      localField: "_id",
      foreignField: "user",
      justone: false,
    });

    // Cascade delete blood drive hosts when a user is deleted
    schema.pre("remove", async function (next) {
      await this.model("BloodDriveHost").deleteMany({ user: this._id });
      next();
    });

    this._model = model<IUser>('User', schema);
  }

  public get model(): Model<IUser> {
    return this._model;
  }
}
