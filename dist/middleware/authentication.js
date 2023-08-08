"use strict";
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
exports.expressAuthentication = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const services_1 = require("../services");
const http_exception_1 = __importDefault(require("../utils/http-exception"));
const enum_1 = require("../constants/enum");
const admin_service_1 = require("../services/admin.service");
function expressAuthentication(request, securityName, scopes) {
    var _a;
    const token = ((_a = request.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new http_exception_1.default(enum_1.HttpStatus.UNAUTHORIZED, "No token provided"));
        }
        // @typescript-eslint/no-explicit-any
        jwt.verify(token, process.env.JWT_SECRET || "", function (err, decoded) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return reject(new http_exception_1.default(enum_1.HttpStatus.UNAUTHORIZED, err.message));
                }
                // Check if JWT contains all required scopes
                if (scopes && scopes.length > 0) {
                    // @typescript-eslint/no-explicit-any
                    if (!scopes.includes(decoded.role[0])) {
                        return reject(new http_exception_1.default(enum_1.HttpStatus.FOBIDDEN, "JWT does not contain required role."));
                    }
                    else if (decoded.role[0] === "user") {
                        const user = yield services_1.UsersService.findUserById(decoded.userId);
                        if (!user) {
                            return reject(new http_exception_1.default(enum_1.HttpStatus.NOT_FOUND, "User not exist"));
                        }
                    }
                    else if (decoded.role[0] === "admin") {
                        const admin = yield admin_service_1.AdminService.findAdminById(decoded.userId);
                        if (!admin) {
                            return reject(new http_exception_1.default(enum_1.HttpStatus.NOT_FOUND, "User not exist"));
                        }
                    }
                    resolve(decoded);
                }
            });
        });
    });
}
exports.expressAuthentication = expressAuthentication;
