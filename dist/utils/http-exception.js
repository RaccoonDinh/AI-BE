"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(statusCode = 500, error = "INTERNAL_SERVER") {
        super(error);
        this.statusCode = statusCode;
        this.error = error;
    }
}
exports.default = HttpException;
