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
var category_1 = require("../../../models/category");
var product_1 = require("../../../models/product");
var setup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var category1, category2, product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                    .post("/api/categories")
                    .set("Cookie", global.signin(true))
                    .send({
                    name: "furniture",
                    products: [],
                })
                    .expect(201)];
            case 1:
                category1 = (_a.sent()).body;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/categories")
                        .set("Cookie", global.signin(true))
                        .send({
                        name: "tables",
                        products: [],
                    })
                        .expect(201)];
            case 2:
                category2 = (_a.sent()).body;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/products")
                        .set("Cookie", global.signin(true))
                        .send({
                        name: "Product1",
                        image: ["image1.jpg", "image2.jpg"],
                        categories: [category1.id, category2.id],
                        description: "This is product 1. It is very good",
                        price: 199,
                        countInStock: 10,
                    })
                        .expect(201)];
            case 3:
                product = (_a.sent()).body;
                return [2 /*return*/, { category1: category1, category2: category2, product: product }];
        }
    });
}); };
it("creates categories and assigns them to newly created product", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category1, category2, product;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), category1 = _a.category1, category2 = _a.category2, product = _a.product;
                expect(product.categories.length).toEqual(2);
                return [2 /*return*/];
        }
    });
}); });
it("asserts that the newly created product has been assigned to its categories", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category1, category2, product;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), category1 = _a.category1, category2 = _a.category2, product = _a.product;
                return [4 /*yield*/, category_1.Category.findById(category1.id)];
            case 2:
                category1 = _b.sent();
                return [4 /*yield*/, category_1.Category.findById(category2.id)];
            case 3:
                category2 = _b.sent();
                expect(category1.products.length).toEqual(1);
                expect(category1.products[0]._id.toString()).toEqual(product.id);
                expect(category2.products.length).toEqual(1);
                expect(category2.products[0]._id.toString()).toEqual(product.id);
                return [2 /*return*/];
        }
    });
}); });
it("updates existing product by adding some and removing other categories", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category1, category2, product, newCategory, updatedProduct;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), category1 = _a.category1, category2 = _a.category2, product = _a.product;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .post("/api/categories")
                        .set("Cookie", global.signin(true))
                        .send({
                        name: "armchair",
                        products: [],
                    })
                        .expect(201)];
            case 2:
                newCategory = (_b.sent()).body;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .put("/api/products/".concat(product.id))
                        .set("Cookie", global.signin(true))
                        .send({
                        name: "Product1",
                        image: ["image1.jpg", "image2.jpg"],
                        categories: [newCategory.id],
                        description: "This is product 1. It is very good",
                        price: 199,
                        countInStock: 10,
                    })
                        .expect(200)];
            case 3:
                updatedProduct = (_b.sent()).body;
                expect(updatedProduct.categories.length).toEqual(1);
                expect(updatedProduct.categories[0]).toEqual(newCategory.id);
                return [2 /*return*/];
        }
    });
}); });
it("deletes a product and remove its reference from its categories", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category1, category2, product;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), category1 = _a.category1, category2 = _a.category2, product = _a.product;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .delete("/api/products/".concat(product.id))
                        .set("Cookie", global.signin(true))
                        .send()
                        .expect(200)];
            case 2:
                _b.sent();
                return [4 /*yield*/, category_1.Category.findById(category1.id)];
            case 3:
                category1 = _b.sent();
                return [4 /*yield*/, category_1.Category.findById(category2.id)];
            case 4:
                category2 = _b.sent();
                expect(category1.products.length).toEqual(0);
                expect(category2.products.length).toEqual(0);
                return [2 /*return*/];
        }
    });
}); });
it("deletes a category and remove its reference form its product", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category1, category2, product;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a = _b.sent(), category1 = _a.category1, category2 = _a.category2, product = _a.product;
                return [4 /*yield*/, (0, supertest_1.default)(app_1.app)
                        .delete("/api/categories/".concat(category1.id))
                        .set("Cookie", global.signin(true))
                        .send()
                        .expect(200)];
            case 2:
                _b.sent();
                return [4 /*yield*/, product_1.Product.findById(product.id)];
            case 3:
                product = _b.sent();
                expect(product.categories.length).toEqual(1);
                return [2 /*return*/];
        }
    });
}); });
