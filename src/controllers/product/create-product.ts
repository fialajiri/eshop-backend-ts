import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Category } from "../../models/category";
import { Product } from "../../models/product";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, categories, description, price, countInStock, image } =
    req.body;

  const newProduct = Product.build({
    name,
    image,
    categories,
    description,
    price,
    countInStock,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await Category.updateMany(
      { _id: newProduct.categories },
      { $push: { products: newProduct._id } }
    );
    await newProduct.save();
    await session.commitTransaction();

    res.status(201).send(newProduct);
  } catch (err) {
    throw new DatabaseConnectionError("Nepodařilo se vytvořit produkt");
  }
};
