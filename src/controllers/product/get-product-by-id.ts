import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Product, ProductDoc } from "../../models/product";

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  let product: (ProductDoc & { _id: any }) | null;

  try {
    product = await Product.findById(productId).populate({ path: "categories", select: "_id, name" });
  } catch (err) {
    throw new DatabaseConnectionError();
  }
  if (!product) {
    throw new NotFoundError();
  }

  res.status(200).send(product);
};
