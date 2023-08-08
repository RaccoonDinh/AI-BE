"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/users/usersService.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AdminService = void 0;
const constants_1 = require("../constants");
const enum_1 = require("../constants/enum");
const admin_1 = __importDefault(require("../models/admin"));
const handle_response_1 = require("../utils/handle-response");
const hash_password_1 = require("../utils/hash-password");
const jwt = __importStar(require("jsonwebtoken"));
class AdminService {
    static create(adminCreationParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = new admin_1.default({
                    name: adminCreationParams.name,
                    username: adminCreationParams.username,
                    password: (0, hash_password_1.hashPasswords)(adminCreationParams.password),
                });
                yield admin.save();
                const adminRes = {
                    _id: admin._id.toString(),
                    name: admin.name,
                };
                return (0, handle_response_1.handlerResSuccess)(constants_1.CREATE_USER_SUCCESS, adminRes);
            }
            catch (error) {
                return (0, handle_response_1.handleResFailure)(constants_1.ERROR_CREATE_USER, enum_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    static login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield admin_1.default.findOne({ username: dto.username });
                if (!admin) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_USER_NOT_FOUND, enum_1.HttpStatus.NOT_FOUND);
                }
                const check = yield (0, hash_password_1.comparePassword)(dto.password, admin.password);
                if (!check) {
                    return (0, handle_response_1.handleResFailure)(constants_1.ERROR_PASSWORD_NOT_MATCH, enum_1.HttpStatus.NOT_ACCEPTABLE);
                }
                return (0, handle_response_1.handlerResSuccess)(constants_1.LOGIN_SUCCESS, jwt.sign({ userId: admin.id, role: ["admin"] }, process.env.JWT_SECRET || ""));
            }
            catch (error) {
                return (0, handle_response_1.handleResFailure)(error.error || constants_1.LOGIN_FAIL, error.statusCode || enum_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    static findAdminById(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admin_1.default.findById(adminId);
            if (!admin) {
                return (0, handle_response_1.handleResFailure)(constants_1.ERROR_GET_USER_BY_ID, enum_1.HttpStatus.NOT_FOUND);
            }
            const res = {
                name: admin === null || admin === void 0 ? void 0 : admin.name,
                username: admin === null || admin === void 0 ? void 0 : admin.username,
            };
            return (0, handle_response_1.handlerResSuccess)(constants_1.FIND_USER_BY_ID_SUCCESS, res);
        });
    }
}
exports.AdminService = AdminService;
