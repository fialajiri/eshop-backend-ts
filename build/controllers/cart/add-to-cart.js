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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = void 0;
var bad_request_error_1 = require("../../errors/bad-request-error");
var database_connection_error_1 = require("../../errors/database-connection-error");
var not_found_error_1 = require("../../errors/not-found-error");
var cart_1 = require("../../models/cart");
var product_1 = require("../../models/product");
var addToCart = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, productId, quantity, cartId, cart, product, err_1, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, productId = _a.productId, quantity = _a.quantity;
                cartId = req.params.cartId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, cart_1.Cart.findById(cartId)];
            case 2:
                cart = _b.sent();
                return [4 /*yield*/, product_1.Product.findById(productId)];
            case 3:
                product = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                throw new database_connection_error_1.DatabaseConnectionError();
            case 5:
                if (!cart || !product) {
                    throw new not_found_error_1.NotFoundError();
                }
                if (product.countInStock < quantity) {
                    throw new bad_request_error_1.BadRequestError("Nelze přidat větší než dostupné množství");
                }
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, cart.addToCart(product, quantity)];
            case 7:
                _b.sent();
                res.status(200).send(cart);
                return [3 /*break*/, 9];
            case 8:
                err_2 = _b.sent();
                console.log(err_2);
                throw new database_connection_error_1.DatabaseConnectionError();
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.addToCart = addToCart;
