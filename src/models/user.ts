import { Document, Schema, SchemaTimestampsConfig, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  active: boolean;
}

export interface IUserModel extends IUser, Document, SchemaTimestampsConfig {}

export const UserSchema: Schema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    active: { type: Boolean, require: true },
  },
  { timestamps: true }
);

const User = model<IUserModel>("User", UserSchema);

export default User;
