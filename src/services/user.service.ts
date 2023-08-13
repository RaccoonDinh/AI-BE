/* eslint-disable @typescript-eslint/no-explicit-any */
// src/users/usersService.ts
import {
  ACTIVE_USER_SUCCESS,
  CREATE_USER_SUCCESS,
  ERROR_CREATE_USER,
  ERROR_GET_USER,
  ERROR_USER_NOT_FOUND,
  FIND_USER_SUCCESS,
  PHONE_NUMBER_EXSITED,
} from "../constants";
import { HttpStatus } from "../constants/enum";
import { ICreateUser } from "../dto/requests/user.dto";
import { IUserInfo } from "../dto/responses";
import { UserResDTO } from "../dto/responses/user.dto";
import User from "../models/user";
import { handleResFailure, handlerResSuccess } from "../utils/handle-response";
import { hashPasswords } from "../utils/hash-password";
import { AuthenticationService } from "./authentication.service";

export class UsersService {
  static async create(userCreationParams: ICreateUser) {
    try {
      const check = await User.findOne({ phone: userCreationParams.phone });

      if (check) {
        return handleResFailure(
          PHONE_NUMBER_EXSITED,
          HttpStatus.NOT_ACCEPTABLE
        );
      }

      const user = new User({
        name: userCreationParams.name,
        email: userCreationParams.email,
        phone: userCreationParams.phone,
        password: hashPasswords(userCreationParams.password),
        address: userCreationParams.address,
        active: false,
      });

      await user.save();

      const token = AuthenticationService.generateToken({
        userId: user._id.toString(),
        role: "user",
      });

      const userRes: UserResDTO = {
        _id: user._id.toString(),
        name: user.name,
        token: token,
      };

      return handlerResSuccess<UserResDTO>(CREATE_USER_SUCCESS, userRes);
    } catch (error) {
      return handleResFailure(ERROR_CREATE_USER, HttpStatus.BAD_REQUEST);
    }
  }

  static async findUserById(userId: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const userRes: UserResDTO = {
        _id: user._id.toString(),
        name: user.name,
        token: "",
      };

      return handlerResSuccess<UserResDTO>(FIND_USER_SUCCESS, userRes);
    } catch (error: any) {
      console.log("error: ", error);
      return handleResFailure(
        error.error ? error.error : ERROR_GET_USER,
        error.statusCode ? error.statusCode : HttpStatus.BAD_REQUEST
      );
    }
  }

  static async getUser(id: string) {
    try {
      const user = await User.findById(id);

      if (!user) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      const res: IUserInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        active: user.active,
      };

      return handlerResSuccess(FIND_USER_SUCCESS, res);
    } catch (error: any) {
      console.log("error: ", error);
      return handleResFailure(
        error.error ? error.error : ERROR_GET_USER,
        error.statusCode ? error.statusCode : HttpStatus.BAD_REQUEST
      );
    }
  }

  static async findUserByPhone(phone: string) {
    try {
      const user = await User.findOne({ phone: phone });
      if (!user) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      const res: IUserInfo = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        active: user.active,
      };

      return handlerResSuccess(FIND_USER_SUCCESS, res);
    } catch (error: any) {
      console.log("error: ", error);
      return handleResFailure(
        error.error ? error.error : ERROR_GET_USER,
        error.statusCode ? error.statusCode : HttpStatus.BAD_REQUEST
      );
    }
  }

  static async activeUser(id: string) {
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      user.active = true;

      user.save();

      return handlerResSuccess(ACTIVE_USER_SUCCESS, true);
    } catch (error: any) {
      console.log("error: ", error);
      return handleResFailure(
        error.error ? error.error : ERROR_GET_USER,
        error.statusCode ? error.statusCode : HttpStatus.BAD_REQUEST
      );
    }
  }

  static async getAllUser() {
    try {
      const userArray: IUserInfo[] = [];
      const allUser = await User.find({});
      if (!allUser) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      allUser.map((user) =>
        userArray.push({
          _id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          active: user.active,
        })
      );
      return handlerResSuccess<IUserInfo[]>(FIND_USER_SUCCESS, userArray);
    } catch (error) {
      console.log("error", error);
      return;
    }
  }
}
