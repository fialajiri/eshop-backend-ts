import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Category } from "../../models/category";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = Category.build({
    name: req.body.name,
    products: [],
  });

  try {
    await category.save();
    res.status(201).send(category);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
