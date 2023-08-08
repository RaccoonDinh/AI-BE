"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AdminSchema = new mongoose_1.Schema({
    name: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true },
}, { timestamps: true });
const Admin = (0, mongoose_1.model)("Admin", exports.AdminSchema);
exports.default = Admin;
