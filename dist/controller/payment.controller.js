"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const tsoa_1 = require("tsoa");
const payment_service_1 = require("../services/payment.service");
let PaymentsController = exports.PaymentsController = class PaymentsController extends tsoa_1.Controller {
    getClientID() {
        return payment_service_1.PaymentsService.getClientID();
    }
};
__decorate([
    (0, tsoa_1.Security)("jwt", ["user"]),
    (0, tsoa_1.Get)("/get-client-id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getClientID", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, tsoa_1.Tags)("Payments"),
    (0, tsoa_1.Route)("payments")
], PaymentsController);
