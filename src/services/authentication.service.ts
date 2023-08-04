/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import {
  ERROR_PASSWORD,
  ERROR_LOGIN,
  ERROR_USER_NOT_FOUND,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SEND_CODE_SUCCESS,
  ERROR_SEND_CODE,
  EMAIL_EXISTS,
} from "../constants";
import { HttpStatus } from "../constants/enum";
import { IEmailVerify, ILoginUser, ISignJWT } from "../dto/requests";
import User from "../models/user";
import { handleResFailure, handlerResSuccess } from "../utils/handle-response";
import { Response as ExResponse } from "express";
import nodemailer from "nodemailer";
import { UserAuthenticate } from "../dto/responses";
import { comparePassword } from "../utils/hash-password";

export class AuthenticationService {
  static generateToken(user: ISignJWT) {
    return jwt.sign(
      {
        userId: user.userId,
        role: [user.role],
      },
      process.env.JWT_SECRET || ""
    );
  }
  static async login(accountParams: ILoginUser) {
    try {
      const user = await User.findOne({ phone: accountParams.lPhone });
      if (!user) {
        return handleResFailure(ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      const validPassword = comparePassword(
        accountParams.lPassword,
        user.password
      );
      if (!validPassword) {
        return handleResFailure(ERROR_PASSWORD, HttpStatus.NOT_FOUND);
      }
      const token = AuthenticationService.generateToken({
        userId: user._id.toString(),
        role: "user",
      });
      console.log(user);
      console.log("token: ", token);
      return handlerResSuccess<UserAuthenticate>(LOGIN_SUCCESS, {
        token,
        name: user.name,
      });
    } catch (error) {
      console.log("error: ", error);
      return handleResFailure(ERROR_LOGIN, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  static async logout(res: ExResponse) {
    res.clearCookie("token");
    return handlerResSuccess<string>(LOGOUT_SUCCESS, "logged out succesfully");
  }
  // tạo mã code random
  static randomCode() {
    let result = "";
    const numbers = "0123456789";
    const numbersLength: number =
      5 + Math.floor((Math.random() * numbers.length) / 3);
    for (let i = 0; i < numbersLength; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return result;
  }

  static async sendVerifyCode(request: IEmailVerify) {
    try {
      const email = await User.findOne({ email: request.email });
      // console.log(email);
      if (email)
        return handleResFailure(EMAIL_EXISTS, HttpStatus.NOT_ACCEPTABLE);
      const code = AuthenticationService.randomCode();
      // Tạo một transport để gửi email
      const transporter = nodemailer.createTransport({
        port: 2525,
        host: "smtp.elasticemail.com",
        auth: {
          user: "vnsaitools@gmail.com",
          pass: process.env.password as string,
        },
      });
      // Thiết lập nội dung email
      const mailOptions = {
        from: "vnsaitools@gmail.com",
        to: request.email,
        subject: "Mã xác thực",
        text: `Mã xác thực của bạn là: ${code}`,
      };
      // Gửi email
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.log("Gửi email thất bại:", error);
        } else {
          console.log("Gửi email thành công:", info.response);
        }
      });
      return handlerResSuccess<string>(SEND_CODE_SUCCESS, code);
    } catch (error) {
      return handleResFailure(
        ERROR_SEND_CODE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
