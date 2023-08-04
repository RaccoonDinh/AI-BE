import { ICreateAdmin, ICreateUser } from "../requests/user.dto";

export type UserResDTO = Pick<ICreateUser, "name"> & { _id: string };

export type AdminResDTO = Pick<ICreateAdmin, "name"> & { _id: string };

export interface IUserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}
