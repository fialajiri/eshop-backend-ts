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
exports.createOrder = void 0;
var database_connection_error_1 = require("../../errors/database-connection-error");
var not_found_error_1 = require("../../errors/not-found-error");
var address_1 = require("../../models/address");
var cart_1 = require("../../models/cart");
var order_1 = require("../../models/order");
var user_1 = require("../../models/user");
var mongoose_1 = __importDefault(require("mongoose"));
var product_1 = require("../../models/product");
var bad_request_error_1 = require("../../errors/bad-request-error");
var createOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cartId, address, paymentMethod, shippingPrice, cart, user, shippingAddress, err_1, newOrder, _i, _b, item, session, _c, _d, orderItem, product, err_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.body, cartId = _a.cartId, address = _a.address, paymentMethod = _a.paymentMethod, shippingPrice = _a.shippingPrice;
                shippingAddress = address_1.Address.build(address);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 4, , 5]);
                return [4 /*yield*/, cart_1.Cart.findById(cartId).populate("items.product")];
            case 2:
                cart = _e.sent();
                return [4 /*yield*/, user_1.User.findById(req.currentUser.id)];
            case 3:
                user = _e.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _e.sent();
                throw new database_connection_error_1.DatabaseConnectionError();
            case 5:
                if (!cart || !user) {
                    throw new not_found_error_1.NotFoundError();
                }
                newOrder = order_1.Order.build({
                    user: user.id,
                });
                for (_i = 0, _b = cart.items; _i < _b.length; _i++) {
                    item = _b[_i];
                    newOrder.orderItems.push({
                        name: item.product.name,
                        quantity: item.quantity,
                        image: item.product.image[0],
                        price: item.product.price,
                        subtotal: item.subTotal,
                        product: item.product.id,
                    });
                }
                newOrder.set({
                    shippingAddress: shippingAddress,
                    paymentMethod: paymentMethod,
                    taxPrice: cart.total,
                    shippingPrice: shippingPrice,
                    totalPrice: cart.total + shippingPrice,
                });
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 6:
                session = _e.sent();
                _e.label = 7;
            case 7:
                _e.trys.push([7, 16, , 18]);
                session.startTransaction();
                _c = 0, _d = newOrder.orderItems;
                _e.label = 8;
            case 8:
                if (!(_c < _d.length)) return [3 /*break*/, 12];
                orderItem = _d[_c];
                return [4 /*yield*/, product_1.Product.findById(orderItem.product)];
            case 9:
                product = _e.sent();
                if (!product) {
                    throw new not_found_error_1.NotFoundError();
                }
                if (product.availability < orderItem.quantity) {
                    // TO-DO: Update the quantity in cart to available quantity
                    throw new bad_request_error_1.BadRequestError("Produkt ".concat(orderItem.name, " ji\u017E nen\u00ED dostupn\u00FD v po\u017Eadovan\u00E9m mno\u017Estv\u00ED. Po\u010Det dostupn\u00FDch kus\u016F: ").concat(product.availability));
                }
                product.set({ availability: product.availability - orderItem.quantity });
                return [4 /*yield*/, product.save({ session: session })];
            case 10:
                _e.sent();
                _e.label = 11;
            case 11:
                _c++;
                return [3 /*break*/, 8];
            case 12: return [4 /*yield*/, newOrder.save({ session: session })];
            case 13:
                _e.sent();
                cart.set({ items: [], total: 0 });
                return [4 /*yield*/, cart.save({ session: session })];
            case 14:
                _e.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 15:
                _e.sent();
                session.endSession();
                res.status(201).send({ order: newOrder, cart: cart });
                return [3 /*break*/, 18];
            case 16:
                err_2 = _e.sent();
                return [4 /*yield*/, session.abortTransaction()];
            case 17:
                _e.sent();
                session.endSession();
                if (err_2 instanceof not_found_error_1.NotFoundError) {
                    throw err_2;
                }
                if (err_2 instanceof bad_request_error_1.BadRequestError) {
                    throw err_2;
                }
                throw new database_connection_error_1.DatabaseConnectionError();
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.createOrder = createOrder;
