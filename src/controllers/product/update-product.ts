import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Product, ProductDoc } from "../../models/product";
import { Category } from "../../models/category";

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const { name, categories, description, price, countInStock, image } =
    req.body;

  let product: (ProductDoc & { _id: any }) | null;

  try {
    product = await Product.findOne({ id: productId });
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!product) {
    throw new NotFoundError();
  }

  const oldCategory = product.categories;

  product.set({ name, categories, image, description, price, countInStock });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await Category.updateMany(
      { _id: product.categories },
      { $push: { products: product._id } },
      { session: session }
    );
    await Category.updateMany(
      { _id: product.categories },
      { $pull: { products: product._id } },
      { session: session }
    );
    await product.save({ session: session });
    await session.commitTransaction();
    res.status(200).send(product);
  } catch (err) {
    throw new DatabaseConnectionError("Nepodařilo se upravit produkt");
  } finally {
    session.endSession();
  }
};
