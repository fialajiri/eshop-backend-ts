import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Category } from "../../models/category";
import { Product, ProductDoc } from "../../models/product";

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  let product: (ProductDoc & { _id: any }) | null;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!product) {
    throw new NotFoundError();
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await Category.updateMany(
      { _id: product.categories },
      { $pull: { products: product._id } },
      { session: session }
    );
    await product.remove({ session: session });
    await session.commitTransaction();
    res.status(200).send();
  } catch (err) {
    throw new DatabaseConnectionError("Nepodařilo se smazat produkt");
  } finally {
    session.endSession();
  }
};
