/* eslint-disable @typescript-eslint/no-explicit-any */
// src/users/usersService.ts

import {
  CREATE_USER_SUCCESS,
  ERROR_CREATE_USER,
  ERROR_GET_USER,
  ERROR_PASSWORD_NOT_MATCH,
  ERROR_USER_NOT_FOUND,
  FIND_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
} from "../constants";
import { HttpStatus } from "../constants/enum";
import {
  AdminLogin,
  ICreateAdmin,
  ResAdmin,
} from "../dto/requests";
import { AdminResDTO } from "../dto/responses";
import Admin from "../models/admin";
import { handleResFailure, handlerResSuccess } from "../utils/handle-response";
import { comparePassword, hashPasswords } from "../utils/hash-password";
import * as jwt from "jsonwebtoken";

export class AdminService {
  static async create(adminCreationParams: ICreateAdmin) {
    try {
      const admin = new Admin({
        name: adminCreationParams.name,
        username: adminCreationParams.username,
        password: hashPasswords(adminCreationParams.password),
      });

      await admin.save();

      const adminRes: AdminResDTO = {
        _id: admin._id.toString(),
        name: admin.name,
      };

      return handlerResSuccess<AdminResDTO>(CREATE_USER_SUCCESS, adminRes);
    } catch (error) {
      return handleResFailure(ERROR_CREATE_USER, HttpStatus.BAD_REQUEST);
    }
  }

  static async login(dto: AdminLogin) {
    try {
      const admin = await Admin.findOne({ username: dto.username });

      if (!admin) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const check = await comparePassword(dto.password, admin.password);

      if (!check) {
        return handleResFailure(
          ERROR_PASSWORD_NOT_MATCH,
          HttpStatus.NOT_ACCEPTABLE
        );
      }

      return handlerResSuccess(
        LOGIN_SUCCESS,
        jwt.sign(
          { userId: admin.id, role: ["admin"] },
          process.env.JWT_SECRET || ""
        )
      );
    } catch (error: any) {
      return handleResFailure(
        error.error || LOGIN_FAIL,
        error.statusCode || HttpStatus.BAD_REQUEST
      );
    }
  }

  static async findAdminById(adminId: string) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return handleResFailure(ERROR_GET_USER, HttpStatus.NOT_FOUND);
    }

    const res: ResAdmin = {
      name: admin?.name,
      username: admin?.username,
    };

    return handlerResSuccess(FIND_USER_SUCCESS, res);
  }
}
