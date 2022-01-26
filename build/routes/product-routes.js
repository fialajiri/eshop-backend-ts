"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var require_admin_1 = require("../middlewares/require-admin");
var validate_request_1 = require("../middlewares/validate-request");
var create_product_1 = require("../controllers/product/create-product");
var delete_product_1 = require("../controllers/product/delete-product");
var get_products_1 = require("../controllers/product/get-products");
var get_product_by_id_1 = require("../controllers/product/get-product-by-id");
var update_product_1 = require("../controllers/product/update-product");
var router = express_1.default.Router();
exports.productRoutes = router;
var productValidation = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 4, max: 30 })
        .withMessage("Název produktu musí mít mezi 4 a 30 znaky."),
    (0, express_validator_1.body)("categories")
        .not()
        .isEmpty()
        .withMessage("Kategorie produktu musí být vyplněna"),
    (0, express_validator_1.body)("images").not().isEmpty().withMessage("Přiložte fotografie"),
    (0, express_validator_1.body)("description")
        .trim()
        .not().isEmpty()
        .isLength({ max: 400 })
        .withMessage("Popis musí mít maximálně 400 znaků"),
    (0, express_validator_1.body)("price").isFloat({ gt: 0 }).withMessage("Cena musí být větší než nula"),
    (0, express_validator_1.body)("countInStock")
        .isInt({ min: 0 })
        .withMessage("Množství skladem musí být větší než nula"),
];
router.get("/api/products", get_products_1.getProducts);
router.get("/api/products/:productId", get_product_by_id_1.getProductById);
router.post("/api/products", 
// requireAdmin,
productValidation, validate_request_1.validateRequest, create_product_1.createProduct);
router.put("/api/products/:productId", require_admin_1.requireAdmin, productValidation, validate_request_1.validateRequest, update_product_1.updateProduct);
router.delete("/api/products/:productId", require_admin_1.requireAdmin, delete_product_1.deleteProduct);
