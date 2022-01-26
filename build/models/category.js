"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var categorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" }],
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
categorySchema.statics.build = function (attrs) {
    return new Category(attrs);
};
var Category = mongoose_1.default.model("Category", categorySchema);
exports.Category = Category;
