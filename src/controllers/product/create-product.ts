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
    image: image,
    categories,
    description,
    price,
    countInStock,
  });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Category.updateMany(
      { _id: newProduct.categories },
      { $push: { products: newProduct._id } }
    ).session(session);

    // TO-DO: Cant put session inside the save method and dont know why
    await newProduct.save();

    await session.commitTransaction();
    session.endSession();

    res.status(201).send(newProduct);
  } catch (err) {
    console.log(err);
    // await session.abortTransaction();
    session.endSession();

    
    throw new DatabaseConnectionError();
  }
};
