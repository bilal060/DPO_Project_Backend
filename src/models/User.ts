import {
  Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
  ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IUsers extends ITimeStampedDocument {
  /** Name of the user */
  email: string;
  /** Secret Password */
  password: string;
  /** Type of authentication method */
  type: string,
  /** resetPasswordToken */
  resetPasswordToken: string;
  /** resetPasswordExpires */
  resetPasswordExpires: Number,
  /** User is activated or not */
  isDeactivated: Boolean;
  /** Phone Number */
  phone: String;
  /** Profile Completed */
  isProfileCompleted: Boolean;

}

interface IUsersModel extends Model<IUsers> { }

const schema = new Schema<IUsers>({
  email: { type: String, index: true, required: true },
  password: { type: String, required: true },
  type: {
    type: String, required: true, default: "admin", enum: ["admin", "owner", "manager", "user"]
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Number },
  isDeactivated: { type: Boolean, default: false },
  phone: {type: String},
  isProfileCompleted: { type: Boolean, default: false }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Users: IUsersModel = model<IUsers, IUsersModel>('users', schema);

export default Users;
