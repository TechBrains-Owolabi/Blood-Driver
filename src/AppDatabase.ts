import { connect, connection, Connection } from 'mongoose';
import { User, UserModel, BloodDriveHost, BloodDriveHostModel, Hospital, HospitalModel } from './models';
import { DatabaseConnectionError } from './errors';

declare interface IModels {
  User: UserModel;
  BloodDriveHost: BloodDriveHostModel;
  Hospital: HospitalModel
}


export class DB {
  private static instance: DB;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    // this is where we make all neccessary connections
    connect(process.env.MONGOURI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this._db = connection;
    this._db.on('open', this.connected);
    this._db.on('error', this.error);

    // this is where we initialize all models
    this._models = {
      User: new User().model,
      BloodDriveHost: new BloodDriveHost().model,
      Hospital: new Hospital().model
    };
  }

  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance._models;
  }

  private connected() {
    console.log('Mongoose has connected');
  }

  private error(error: Error) {
    throw new DatabaseConnectionError(error.message);
  }
}
