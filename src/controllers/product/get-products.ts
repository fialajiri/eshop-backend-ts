import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Category } from "../../models/category";
import { Product } from "../../models/product";
import { CategoryDoc } from "../../models/category";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

      

    const categoryId = req.query.categoryId
      ? {
          categories: {
            _id: req.query.categoryId,
          },
        }
      : {};

    let category: (CategoryDoc & { _id: any }) | null = null;

    if (req.query.categoryId) {
      category = await Category.findById(req.query.categoryId);
    }

    const count = await Product.count({ ...keyword, ...categoryId });
    const products = await Product.find({ ...keyword, ...categoryId })
      .populate({ path: "categories", select: "_id, name" })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      category,
    });
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
