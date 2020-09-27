import { Password } from '../services';

import { Schema, model, Document, Model } from 'mongoose';

declare interface IUser extends Document {
  email: string;
  password: string;
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
        email: { type: String, required: true },
        password: { type: String, required: true },
      },
      {
        toJSON: {
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

    this._model = model<IUser>('User', schema);
  }

  public get model(): Model<IUser> {
    return this._model;
  }
}
