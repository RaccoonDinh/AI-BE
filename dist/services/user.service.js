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
exports.UsersService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/users/usersService.ts
const constants_1 = require("../constants");
const enum_1 = require("../constants/enum");
const user_1 = __importDefault(require("../models/user"));
const handle_response_1 = require("../utils/handle-response");
const hash_password_1 = require("../utils/hash-password");
class UsersService {
    static create(userCreationParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield user_1.default.findOne({ phone: userCreationParams.phone });
                if (check) {
                    return (0, handle_response_1.handleResFailure)(constants_1.PHONE_NUMBER_EXSITED, enum_1.HttpStatus.NOT_ACCEPTABLE);
                }
                const user = new user_1.default({
                    name: userCreationParams.name,
                    email: userCreationParams.email,
                    phone: userCreationParams.phone,
                    password: (0, hash_password_1.hashPasswords)(userCreationParams.password),
                    address: userCreationParams.address,
                });
                yield user.save();
                const userRes = {
                    _id: user._id.toString(),
                    name: user.name,
                };
                return (0, handle_response_1.handlerResSuccess)(constants_1.CREATE_USER_SUCCESS, userRes);
            }
            catch (error) {
                return (0, handle_response_1.handleResFailure)(constants_1.ERROR_CREATE_USER, enum_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    static findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_USER_NOT_FOUND, enum_1.HttpStatus.NOT_FOUND);
                }
                const userRes = {
                    _id: user._id.toString(),
                    name: user.name,
                };
                return (0, handle_response_1.handlerResSuccess)(constants_1.FIND_USER_BY_ID_SUCCESS, userRes);
            }
            catch (error) {
                console.log("error: ", error);
                return (0, handle_response_1.handleResFailure)(error.error ? error.error : constants_1.ERROR_GET_USER_BY_ID, error.statusCode ? error.statusCode : enum_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(id);
                if (!user) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_USER_NOT_FOUND, enum_1.HttpStatus.NOT_FOUND);
                }
                const res = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                };
                return (0, handle_response_1.handlerResSuccess)(constants_1.FIND_USER_BY_ID_SUCCESS, res);
            }
            catch (error) {
                console.log("error: ", error);
                return (0, handle_response_1.handleResFailure)(error.error ? error.error : constants_1.ERROR_GET_USER_BY_ID, error.statusCode ? error.statusCode : enum_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
}
exports.UsersService = UsersService;
