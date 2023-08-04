/* eslint-disable @typescript-eslint/no-explicit-any */
// src/users/usersService.ts
import {
  CREATE_USER_SUCCESS,
  ERROR_CREATE_USER,
  ERROR_GET_USER_BY_ID,
  ERROR_USER_NOT_FOUND,
  FIND_USER_BY_ID_SUCCESS,
  PHONE_NUMBER_EXSITED,
} from "../constants";
import { HttpStatus } from "../constants/enum";
import { ICreateUser } from "../dto/requests/user.dto";
import { IUserInfo } from "../dto/responses";
import { UserResDTO } from "../dto/responses/user.dto";
import User from "../models/user";
import { handleResFailure, handlerResSuccess } from "../utils/handle-response";
import { hashPasswords } from "../utils/hash-password";

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
      });

      await user.save();

      const userRes: UserResDTO = {
        _id: user._id.toString(),
        name: user.name,
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
      };

      return handlerResSuccess<UserResDTO>(FIND_USER_BY_ID_SUCCESS, userRes);
    } catch (error: any) {
      console.log("error: ", error);
      return handleResFailure(
        error.error ? error.error : ERROR_GET_USER_BY_ID,
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
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      };

      return handlerResSuccess(FIND_USER_BY_ID_SUCCESS, res);
    } catch (error: any) {
      console.log("error: ", error);
      return handleResFailure(
        error.error ? error.error : ERROR_GET_USER_BY_ID,
        error.statusCode ? error.statusCode : HttpStatus.BAD_REQUEST
      );
    }
  }
}
