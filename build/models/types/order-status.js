"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "created";
    OrderStatus["Cancelled"] = "cancelled";
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    OrderStatus["Paid"] = "paid";
    OrderStatus["Delivered"] = "delivered";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
