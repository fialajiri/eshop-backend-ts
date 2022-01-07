import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Product } from "../../models/product";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
