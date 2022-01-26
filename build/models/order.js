"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var payment_method_1 = require("./types/payment-method");
var address_1 = require("./address");
var order_status_1 = require("./types/order-status");
var orderSchema = new mongoose_1.default.Schema({
    user: { type: String, required: true },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            subtotal: { type: Number, required: true },
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    shippingAddress: address_1.addressSchema,
    paymentMethod: {
        type: String,
        required: true,
        enum: Object.values(payment_method_1.PaymentMethods),
    },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    orderStatus: {
        type: String,
        required: true,
        enum: Object.values(order_status_1.OrderStatus),
        default: order_status_1.OrderStatus.Created,
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
orderSchema.statics.build = function (attrs) {
    return new Order(attrs);
};
var Order = mongoose_1.default.model("Order", orderSchema);
exports.Order = Order;
