"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AdminSchema = new mongoose_1.Schema({
    thumbnail: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    link: { type: String, require: true },
}, { timestamps: true });
const Tool = (0, mongoose_1.model)("Tool", exports.AdminSchema);
exports.default = Tool;
