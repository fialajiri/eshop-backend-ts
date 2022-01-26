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
var category_1 = require("../../../models/category");
var product_1 = require("../../../models/product");
var cart_1 = require("../../../models/cart");
var address_1 = require("../../../models/address");
var payment_method_1 = require("../../../models/types/payment-method");
var user_1 = require("../../../models/user");
var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var category, product1, product2, cart, address, user;
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
                    price: 1000,
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
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/addtocart/".concat(cart.id))
                        .send({
                        productId: product2.id,
                        quantity: 2,
                    })
                        .expect(200)];
            case 6:
                _a.sent();
                address = address_1.Address.build({
                    firstName: "Jiri",
                    lastName: "Fiala",
                    phone: "602107243",
                    street: "Karoliny Svetle",
                    streetNumber: "1794/1",
                    city: "Teplice",
                    postal: "41501",
                });
                user = user_1.User.build({
                    email: "test@test.com",
                    password: "123456",
                    isAdmin: true,
                });
                return [4 /*yield*/, user.save()];
            case 7:
                _a.sent();
                return [2 /*return*/, { cart: cart, address: address, user: user, product1: product1, product2: product2 }];
        }
    });
}); };
it("return a 401 if the user is not authenticated", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.app).post("/api/orders").send().expect(401)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("return a 404 if the cartId is invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
    var nonExistentCartId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nonExistentCartId = new mongoose_1.default.Types.ObjectId().toHexString();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/orders")
                        .set("Cookie", global.signin(false))
                        .send({
                        cartId: nonExistentCartId,
                    })
                        .expect(404)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("thorw an error if the users tries to order bigger than available quantity", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cart, address, user, product1, category, product, updatedCart, product1Updated;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), cart = _a.cart, address = _a.address, user = _a.user, product1 = _a.product1;
                category = category_1.Category.build({
                    name: "Swiss watches",
                    products: [],
                });
                return [4 /*yield*/, category.save()];
            case 2:
                _b.sent();
                product = product_1.Product.build({
                    name: "Omega Constalation",
                    price: 10000,
                    image: ["omega.image.jpg"],
                    description: "A great swiss watch",
                    countInStock: 10,
                    categories: [category],
                });
                product.set({ availability: 6 });
                return [4 /*yield*/, product.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/addtocart/".concat(cart.id))
                        .send({
                        productId: product.id,
                        quantity: 8,
                    })
                        .expect(200)];
            case 4:
                updatedCart = (_b.sent()).body;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/orders")
                        .set("Cookie", global.signin(false, user.id))
                        .send({
                        cartId: cart.id,
                        address: address,
                        paymentMethod: payment_method_1.PaymentMethods.Paypal,
                        shippingPrice: 200,
                    })
                        .expect(400)];
            case 5:
                _b.sent();
                return [4 /*yield*/, product_1.Product.findById(product1.id)];
            case 6:
                product1Updated = _b.sent();
                expect(product1Updated === null || product1Updated === void 0 ? void 0 : product1Updated.availability).toEqual(10);
                return [2 /*return*/];
        }
    });
}); });
it("creates an order from valid cart", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cart, address, user, order;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), cart = _a.cart, address = _a.address, user = _a.user;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/orders")
                        .set("Cookie", global.signin(false, user.id))
                        .send({
                        cartId: cart.id,
                        address: address,
                        paymentMethod: payment_method_1.PaymentMethods.Paypal,
                        shippingPrice: 200,
                    })
                        .expect(201)];
            case 2:
                order = (_b.sent()).body.order;
                return [2 /*return*/];
        }
    });
}); });
it("creates an order from valid cart and set reduces products availability by the ordered quantity", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cart, address, user, product1, product2, product1Updated, product2Updated;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), cart = _a.cart, address = _a.address, user = _a.user, product1 = _a.product1, product2 = _a.product2;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/orders")
                        .set("Cookie", global.signin(false, user.id))
                        .send({
                        cartId: cart.id,
                        address: address,
                        paymentMethod: payment_method_1.PaymentMethods.Paypal,
                        shippingPrice: 200,
                    })
                        .expect(201)];
            case 2:
                _b.sent();
                return [4 /*yield*/, product_1.Product.findById(product1.id)];
            case 3:
                product1Updated = _b.sent();
                return [4 /*yield*/, product_1.Product.findById(product2.id)];
            case 4:
                product2Updated = _b.sent();
                expect(product1Updated === null || product1Updated === void 0 ? void 0 : product1Updated.availability).toEqual(5);
                expect(product2Updated === null || product2Updated === void 0 ? void 0 : product2Updated.availability).toEqual(8);
                return [2 /*return*/];
        }
    });
}); });
