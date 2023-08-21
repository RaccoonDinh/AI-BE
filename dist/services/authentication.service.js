"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const enum_1 = require("../constants/enum");
const user_1 = __importDefault(require("../models/user"));
const handle_response_1 = require("../utils/handle-response");
const nodemailer_1 = __importDefault(require("nodemailer"));
const hash_password_1 = require("../utils/hash-password");
class AuthenticationService {
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({
            userId: user.userId,
            role: [user.role],
        }, process.env.JWT_SECRET || "");
    }
    static login(accountParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ phone: accountParams.lPhone });
                if (!user) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_USER_NOT_FOUND, enum_1.HttpStatus.NOT_FOUND);
                }
                const validPassword = (0, hash_password_1.comparePassword)(accountParams.lPassword, user.password);
                if (!validPassword) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_PASSWORD, enum_1.HttpStatus.NOT_FOUND);
                }
                // console.log(validPassword);
                const token = AuthenticationService.generateToken({
                    userId: user._id.toString(),
                    role: "user",
                });
                console.log(user);
                console.log("token: ", token);
                return (0, handle_response_1.handlerResSuccess)(constants_1.LOGIN_SUCCESS, {
                    token,
                    name: user.name,
                });
            }
            catch (error) {
                console.log("error: ", error);
                return (0, handle_response_1.handleResFailure)(constants_1.ERROR_LOGIN, enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    static sign(accountParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ phone: accountParams });
                if (!user) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_USER_NOT_FOUND, enum_1.HttpStatus.NOT_FOUND);
                }
                const token = AuthenticationService.generateToken({
                    userId: user._id.toString(),
                    role: "user",
                });
                console.log(user);
                console.log("token: ", token);
                return (0, handle_response_1.handlerResSuccess)(constants_1.LOGIN_SUCCESS, {
                    token,
                    name: user.name,
                });
            }
            catch (error) {
                console.log("error: ", error);
                return (0, handle_response_1.handleResFailure)(constants_1.ERROR_LOGIN, enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    static logout(res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("token");
            return (0, handle_response_1.handlerResSuccess)(constants_1.LOGOUT_SUCCESS, "logged out succesfully");
        });
    }
    // tạo mã code random
    static randomCode() {
        let result = "";
        const numbers = "0123456789";
        const numbersLength = 5 + Math.floor((Math.random() * numbers.length) / 3);
        for (let i = 0; i < numbersLength; i++) {
            result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return result;
    }
    static sendVerifyCode(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = yield user_1.default.findOne({ email: request.email });
                // console.log(email);
                if (email)
                    return (0, handle_response_1.handleResFailure)(constants_1.EMAIL_EXISTS, enum_1.HttpStatus.NOT_ACCEPTABLE);
                const code = AuthenticationService.randomCode();
                // Tạo một transport để gửi email
                const transporter = nodemailer_1.default.createTransport({
                    port: 2525,
                    host: "smtp.elasticemail.com",
                    auth: {
                        user: "maihuynhtrung0@gmail.com",
                        pass: process.env.password,
                    },
                });
                // Thiết lập nội dung email
                const mailOptions = {
                    from: "maihuynhtrung0@gmail.com",
                    to: request.email,
                    subject: "Mã xác thực",
                    text: `Mã xác thực của bạn là: ${code}`,
                };
                // Gửi email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Gửi email thất bại:", error);
                    }
                    else {
                        console.log("Gửi email thành công:", info.response);
                    }
                });
                return (0, handle_response_1.handlerResSuccess)(constants_1.SEND_CODE_SUCCESS, code);
            }
            catch (error) {
                return (0, handle_response_1.handleResFailure)(constants_1.ERROR_SEND_CODE, enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.AuthenticationService = AuthenticationService;
