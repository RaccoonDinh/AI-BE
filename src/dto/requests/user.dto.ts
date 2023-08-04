
export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
}

export interface ILoginUser {
  lPhone: string;
  lPassword: string;
}

export interface ISignJWT {
  userId: string;
  role: string;
}

export interface ICreateAdmin {
  name: string;
  username: string;
  password: string;
}

export interface IUpdateAdmin {
  name?: string;
  password?: string;
  oldPassword: string;
}

export type ResAdmin = Pick<ICreateAdmin, "username" | "name">;

export type AdminLogin = Pick<ICreateAdmin, "username" | "password">;

export type IEmailVerify = Pick<ICreateUser, "email">;
