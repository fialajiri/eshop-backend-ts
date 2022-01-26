"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    image: [{ type: String, required: true }],
    categories: [{ type: mongoose_1.default.Types.ObjectId, ref: "Category" }],
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    availability: {
        type: Number,
        default: function () {
            var _t = this;
            return _t.countInStock;
        },
    },
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
productSchema.statics.build = function (attrs) {
    return new Product(attrs);
};
var Product = mongoose_1.default.model("Product", productSchema);
exports.Product = Product;
