import express from "express";
import { body } from "express-validator";

import { requireAdmin } from "../middlewares/require-admin";
import { validateRequest } from "../middlewares/validate-request";

import { createProduct } from "../controllers/product/create-product";
import { deleteProduct } from "../controllers/product/delete-product";
import { getProducts } from "../controllers/product/get-products";
import { getProductById } from "../controllers/product/get-product-by-id";
import { updateProduct } from "../controllers/product/update-product";

const router = express.Router();

const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Název produktu musí mít mezi 4 a 30 znaky."),
  body("categories")    
    .not()
    .isEmpty()
    .withMessage("Kategorie produktu musí být vyplněna"),
  body("images").not().isEmpty().withMessage("Přiložte fotografie"),
  body("description")
    .trim()
    .not().isEmpty()
    .isLength({ max: 400 })
    .withMessage("Popis musí mít maximálně 400 znaků"),
  body("price").isFloat({ gt: 0 }).withMessage("Cena musí být větší než nula"),
  body("countInStock")
    .isInt({ min: 0 })
    .withMessage("Množství skladem musí být větší než nula"),
];

router.get("/api/products", getProducts);

router.get("/api/products/:productId", getProductById);

router.post(
  "/api/products",
  // requireAdmin,
  productValidation,
  validateRequest,
  createProduct
);

router.put(
  "/api/products/:productId",
  requireAdmin,
  productValidation,
  validateRequest,
  updateProduct
);

router.delete("/api/products/:productId", requireAdmin, deleteProduct);

export { router as productRoutes };
