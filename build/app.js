"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var cookie_session_1 = __importDefault(require("cookie-session"));
var cors_1 = __importDefault(require("cors"));
var error_handler_1 = require("./middlewares/error-handler");
var current_user_1 = require("./middlewares/current-user");
var not_found_error_1 = require("./errors/not-found-error");
var user_routes_1 = require("./routes/user-routes");
var product_routes_1 = require("./routes/product-routes");
var category_routes_1 = require("./routes/category-routes");
var cart_routes_1 = require("./routes/cart-routes");
var order_routes_1 = require("./routes/order-routes");
var upload_routes_1 = require("./routes/upload-routes");
var corsOptions = {
    origin: true,
    credentials: true,
};
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: false,
    httpOnly: true,
    sameSite: 'none',
}));
app.use(current_user_1.currentUser);
app.use(user_routes_1.userRoutes);
app.use(product_routes_1.productRoutes);
app.use(category_routes_1.categoryRoutes);
app.use(cart_routes_1.cartRoutes);
app.use(order_routes_1.OrderRoutes);
app.use(upload_routes_1.uploadRoutes);
app.all("*", function () {
    throw new not_found_error_1.NotFoundError();
});
app.use(error_handler_1.errorHandler);
