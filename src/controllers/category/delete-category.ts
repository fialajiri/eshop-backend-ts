import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Category, CategoryDoc } from "../../models/category";
import { Product } from "../../models/product";

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;
  let category: (CategoryDoc & { _id: any }) | null;

  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!category) {
    throw new NotFoundError();
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await category.remove({ session: session });
    await Product.updateMany(
      { _id: category.products },
      { $pull: { categories: category._id } },
      { session: session }
    );
    await session.commitTransaction();
    res.status(200).send();
  } catch (err) {
    throw new DatabaseConnectionError();
  } finally {
    session.endSession();
  }
};
