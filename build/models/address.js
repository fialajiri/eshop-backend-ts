"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = exports.addressSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.addressSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    streetNumber: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String, required: true },
});
exports.addressSchema.statics.build = function (attrs) {
    return new Address(attrs);
};
var Address = mongoose_1.default.model("Address", exports.addressSchema);
exports.Address = Address;
