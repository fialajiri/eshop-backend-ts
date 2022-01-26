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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var app_1 = require("../../../app");
var mongoose_1 = __importDefault(require("mongoose"));
var cart_1 = require("../../../models/cart");
var product_1 = require("../../../models/product");
var category_1 = require("../../../models/category");
var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var category, product1, product2, cart;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                category = category_1.Category.build({
                    name: "Swiss watches",
                    products: [],
                });
                return [4 /*yield*/, category.save()];
            case 1:
                _a.sent();
                product1 = product_1.Product.build({
                    name: "Omega Seamaster",
                    price: 4999,
                    image: ["omega.image.jpg"],
                    description: "A great swiss watch",
                    countInStock: 10,
                    categories: [category],
                });
                return [4 /*yield*/, product1.save()];
            case 2:
                _a.sent();
                product2 = product_1.Product.build({
                    name: "Omega de Ville",
                    price: 2999,
                    image: ["omega.image.jpg"],
                    description: "A great swiss watch",
                    countInStock: 10,
                    categories: [category],
                });
                return [4 /*yield*/, product2.save()];
            case 3:
                _a.sent();
                cart = cart_1.Cart.build({});
                return [4 /*yield*/, cart.save()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/addtocart/".concat(cart.id))
                        .send({
                        productId: product1.id,
                        quantity: 5,
                    })
                        .expect(200)];
            case 5:
                _a.sent();
                return [2 /*return*/, { product1: product1, cart: cart, product2: product2 }];
        }
    });
}); };
it("returns a 404 if the product does not exists", function () { return __awaiter(void 0, void 0, void 0, function () {
    var cart, nonExistentProductId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                cart = (_a.sent()).cart;
                nonExistentProductId = new mongoose_1.default.Types.ObjectId().toHexString();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/subtractfromcart/".concat(cart.id))
                        .send({
                        productId: nonExistentProductId,
                        quantity: 1,
                    })
                        .expect(404)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("returns a 400 if the product is not in the cart", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cart, product2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), cart = _a.cart, product2 = _a.product2;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/subtractfromcart/".concat(cart.id))
                        .send({
                        productId: product2.id,
                        quantity: 1,
                    })
                        .expect(400)];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
it("returns a 404 if the cart does not exists", function () { return __awaiter(void 0, void 0, void 0, function () {
    var product1, nonExistentCartId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                product1 = (_a.sent()).product1;
                nonExistentCartId = new mongoose_1.default.Types.ObjectId().toHexString();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/subtractfromcart/".concat(nonExistentCartId))
                        .send({
                        productId: product1.id,
                        quantity: 1,
                    })
                        .expect(404)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("returns a 400 if the subtracted quantity is greater than the quantity in the cart", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product1, cart;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), product1 = _a.product1, cart = _a.cart;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/subtractfromcart/".concat(cart.id))
                        .send({
                        productId: product1.id,
                        quantity: 7,
                    })
                        .expect(400)];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
it("removes the item from the cart if the subtracted quantity is equal to quantity in cart", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product1, cart, updatedCart;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), product1 = _a.product1, cart = _a.cart;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/subtractfromcart/".concat(cart.id))
                        .send({
                        productId: product1.id,
                        quantity: 5,
                    })
                        .expect(200)];
            case 2:
                updatedCart = (_b.sent()).body;
                expect(updatedCart.items.length).toEqual(0);
                return [2 /*return*/];
        }
    });
}); });
