"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var require_admin_1 = require("../middlewares/require-admin");
var validate_request_1 = require("../middlewares/validate-request");
var get_categories_1 = require("../controllers/category/get-categories");
var create_category_1 = require("../controllers/category/create-category");
var delete_category_1 = require("../controllers/category/delete-category");
var router = express_1.default.Router();
exports.categoryRoutes = router;
router.get("/api/categories", get_categories_1.getCategories);
router.post("/api/categories", 
// requireAdmin,
[
    (0, express_validator_1.body)("name")
        .isLength({ min: 2, max: 20 })
        .withMessage("Název kategorie musí mít mezi 2 a 20 znaky"),
], validate_request_1.validateRequest, create_category_1.createCategory);
router.delete("/api/categories/:categoryId", require_admin_1.requireAdmin, delete_category_1.deleteCategory);
