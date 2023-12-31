"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = exports.generateString = void 0;
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const generateString = (length) => {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateString = generateString;
const generateOrderId = () => {
    const createdAt = new Date();
    const orderId = `${createdAt.getFullYear().toString().slice(-2)}${(createdAt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${createdAt
        .getDate()
        .toString()
        .padStart(2, "0")}${(0, exports.generateString)(8)}`;
    return orderId;
};
exports.generateOrderId = generateOrderId;
