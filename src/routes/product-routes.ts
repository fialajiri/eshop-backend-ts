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

router.get("/api/products", getProducts);

router.get("api/products/:id", getProductById);

router.post(
  "/api/products",
  requireAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 4, max: 30 })
      .withMessage("Název produktu musí mít mezi 4 a 30 znaky."),
    body("category").trim().notEmpty(),
    body("description")
      .trim()
      .isLength({ max: 200 })
      .withMessage("Popis musí mít maximálně 200 znaků"),
    body("price").isFloat({ gt: 0 }),
    body("countInStock").isInt({ gt: -1 }),
  ],
  validateRequest,
  createProduct
);

router.put(
  "/api/products/:id",
  requireAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 4, max: 30 })
      .withMessage("Název produktu musí mít mezi 4 a 30 znaky."),
    body("category").trim().notEmpty(),
    body("description")
      .trim()
      .isLength({ max: 200 })
      .withMessage("Popis musí mít maximálně 200 znaků"),
    body("price").isFloat({ gt: 0 }),
    body("countInStock").isInt({ gt: -1 }),
  ],
  validateRequest,
  updateProduct
);

router.delete("/api/products/:id", requireAdmin, deleteProduct);

export { router as productRoutes };
