"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var cartSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    items: [
        {
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
            },
            quantity: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            subTotal: { type: Number, default: 0, required: true },
        },
    ],
    total: { type: Number, default: 0, required: true },
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
cartSchema.statics.build = function (attrs) {
    return new Cart(attrs);
};
cartSchema.methods.addToCart = function name(product, quantity) {
    return __awaiter(this, void 0, void 0, function () {
        var cartProductIndex, newQuantity, updatedCartItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cartProductIndex = this.items.findIndex(function (cp) {
                        return cp.product._id.toString() === product.id.toString();
                    });
                    updatedCartItems = __spreadArray([], this.items, true);
                    if (!(quantity < 0 &&
                        cartProductIndex >= 0 &&
                        this.items[cartProductIndex].quantity <= Math.abs(quantity))) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.removeFromCart(product.id)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (cartProductIndex >= 0) {
                        newQuantity = this.items[cartProductIndex].quantity + quantity;
                        updatedCartItems[cartProductIndex].quantity = newQuantity;
                        updatedCartItems[cartProductIndex].subTotal =
                            updatedCartItems[cartProductIndex].quantity * product.price;
                        updatedCartItems[cartProductIndex].price = product.price;
                        updatedCartItems[cartProductIndex].image = product.image[0];
                        updatedCartItems[cartProductIndex].name = product.name;
                    }
                    else {
                        updatedCartItems.push({
                            product: product.id,
                            quantity: quantity,
                            image: product.image[0],
                            name: product.name,
                            price: product.price,
                            subTotal: product.price * quantity,
                        });
                    }
                    _a.label = 3;
                case 3:
                    this.items = updatedCartItems;
                    this.total = this.items
                        .map(function (item) { return item.subTotal; })
                        .reduce(function (acc, next) { return acc + next; });
                    return [4 /*yield*/, this.save()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
cartSchema.methods.subtractFromCart = function (product, removedQuantity) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.addToCart(product, -removedQuantity)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
cartSchema.methods.removeFromCart = function (productId) {
    return __awaiter(this, void 0, void 0, function () {
        var updatedCartItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updatedCartItems = this.items.filter(function (item) {
                        return item.product._id.toString() !== productId.toString();
                    });
                    this.items = updatedCartItems;
                    if (this.items.length === 0) {
                        this.total = 0;
                    }
                    else {
                        this.total = this.items
                            .map(function (item) { return item.subTotal; })
                            .reduce(function (acc, next) { return acc + next; });
                    }
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
cartSchema.methods.clearCart = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.items = [];
                    this.total = 0;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var Cart = mongoose_1.default.model("Cart", cartSchema);
exports.Cart = Cart;
// cartSchema.methods.addToCart = async function name(
//   product: ProductDoc,
//   quantity: number
// ) {
//   const cartProductIndex = this.items.findIndex((cp: any) => {
//     return cp.product._id.toString() === product.id.toString();
//   });
//   let newQuantity: number;
//   const updatedCartItems = [...this.items];
//   if (cartProductIndex >= 0) {
//     newQuantity = this.items[cartProductIndex].quantity + quantity;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//     updatedCartItems[cartProductIndex].subTotal =
//       updatedCartItems[cartProductIndex].quantity * product.price;
//     updatedCartItems[cartProductIndex].price = product.price;
//   } else {
//     updatedCartItems.push({
//       product: product.id,
//       quantity: quantity,
//       price: product.price,
//       subTotal: product.price * quantity,
//     });
//   }
//   this.items = updatedCartItems;
//   this.total = this.items
//     .map((item: any) => item.subTotal)
//     .reduce((acc: number, next: number) => acc + next);
//   await this.save();
// };
// cartSchema.methods.subtractFromCart = async function (
//   product: ProductDoc,
//   removedQuantity: number
// ) {
// const cartProductIndex = this.items.findIndex((cp: any) => {
//   return cp.product._id.toString() === product.id.toString();
// });
// let newQuantity: number;
// const updatedCartItems = [...this.items];
// if (
//   cartProductIndex >= 0 &&
//   this.items[cartProductIndex].quantity <= removedQuantity
// ) {
//   const updatedCart = await this.removeFromCart(product.id);
//   return updatedCart;
// } else if (cartProductIndex >= 0) {
//   newQuantity = this.items[cartProductIndex].quantity - removedQuantity;
//   updatedCartItems[cartProductIndex].quantity = newQuantity;
//   updatedCartItems[cartProductIndex].subTotal =
//     updatedCartItems[cartProductIndex].quantity * product.price;
//   updatedCartItems[cartProductIndex].price = product.price;
// }
// this.items = updatedCartItems;
// this.total = this.items
//   .map((item: any) => item.subTotal)
//   .reduce((acc: number, next: number) => acc + next);
// await this.save();
