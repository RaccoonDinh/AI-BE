"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const tsoa_1 = require("tsoa");
const http_exception_1 = __importDefault(require("./http-exception"));
function errorHandler(err, req, res, next) {
    console.log("err: ", err);
    if (err instanceof tsoa_1.ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err === null || err === void 0 ? void 0 : err.fields,
        });
    }
    if (err instanceof http_exception_1.default) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            error: err.error,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next();
}
exports.errorHandler = errorHandler;
