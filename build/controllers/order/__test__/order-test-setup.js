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
exports.orderTestSetup = void 0;
var supertest_1 = __importDefault(require("supertest"));
var app_1 = require("../../../app");
var payment_method_1 = require("../../../models/types/payment-method");
var cart_1 = require("../../../models/cart");
var category_1 = require("../../../models/category");
var address_1 = require("../../../models/address");
var user_1 = require("../../../models/user");
var product_1 = require("../../../models/product");
var orderTestSetup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var category, product, address, user, cart1, cart2, orderOne, OrderTwo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                category = category_1.Category.build({
                    name: "Swiss watches",
                    products: [],
                });
                product = product_1.Product.build({
                    name: "Omega Seamaster",
                    price: 1000,
                    image: ["omega.image.jpg"],
                    description: "A great swiss watch",
                    countInStock: 10,
                    categories: [category],
                });
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
                return [4 /*yield*/, product.save()];
            case 1:
                _a.sent();
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                cart1 = cart_1.Cart.build({});
                cart2 = cart_1.Cart.build({});
                return [4 /*yield*/, cart1.save()];
            case 3:
                _a.sent();
                return [4 /*yield*/, cart2.save()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/addtocart/".concat(cart1.id))
                        .send({
                        productId: product.id,
                        quantity: 5,
                    })
                        .expect(200)];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/cart/addtocart/".concat(cart2.id))
                        .send({
                        productId: product.id,
                        quantity: 1,
                    })
                        .expect(200)];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/orders")
                        .set("Cookie", global.signin(false, user.id))
                        .send({
                        cartId: cart1.id,
                        address: address,
                        paymentMethod: payment_method_1.PaymentMethods.Paypal,
                        shippingPrice: 400,
                    })
                        .expect(201)];
            case 7:
                orderOne = (_a.sent()).body;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/orders")
                        .set("Cookie", global.signin(false, user.id))
                        .send({
                        cartId: cart2.id,
                        address: address,
                        paymentMethod: payment_method_1.PaymentMethods.Paypal,
                        shippingPrice: 200,
                    })
                        .expect(201)];
            case 8:
                OrderTwo = (_a.sent()).body;
                return [2 /*return*/, { user: user, orderOne: orderOne, OrderTwo: OrderTwo, product: product }];
        }
    });
}); };
exports.orderTestSetup = orderTestSetup;
