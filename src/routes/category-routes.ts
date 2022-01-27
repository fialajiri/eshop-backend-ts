import express from "express";
import { body } from "express-validator";

import { requireAdmin } from "../middlewares/require-admin";
import { validateRequest } from "../middlewares/validate-request";

import { getCategories } from "../controllers/category/get-categories";
import { createCategory } from "../controllers/category/create-category";
import { deleteCategory } from "../controllers/category/delete-category";

const router = express.Router();

router.get("/api/categories", getCategories);

router.post(
  "/api/categories",
  requireAdmin,
  [
    body("name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Název kategorie musí mít mezi 2 a 20 znaky"),
  ],
  validateRequest,
  createCategory
);

router.delete("/api/categories/:categoryId", requireAdmin, deleteCategory);

export { router as categoryRoutes };
