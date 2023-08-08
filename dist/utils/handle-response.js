"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResFailure = exports.handlerResSuccess = void 0;
const http_exception_1 = __importDefault(require("./http-exception"));
function handlerResSuccess(message, data) {
    return {
        message,
        data,
    };
}
exports.handlerResSuccess = handlerResSuccess;
function handleResFailure(error, statusCode) {
    throw new http_exception_1.default(statusCode, error);
}
exports.handleResFailure = handleResFailure;
