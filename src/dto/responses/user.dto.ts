import { ICreateAdmin, ICreateUser } from "../requests/user.dto";

export type UserResDTO = Pick<ICreateUser, "name"> & { _id: string } & {
  token: string;
};

export type AdminResDTO = Pick<ICreateAdmin, "name"> & { _id: string };

export interface IUserInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}
