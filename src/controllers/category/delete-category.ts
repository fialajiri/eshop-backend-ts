import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Category, CategoryDoc } from "../../models/category";

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const categoryId = req.params;
    let category : (CategoryDoc & {_id: any}) | null

    try {
        category = await Category.findById(categoryId)
    } catch (err){
        throw new DatabaseConnectionError()
    }

    if(!category){
        throw new NotFoundError()
    }

    try{
        await category.remove()
        res.status(200).send()

    } catch (err){
        throw new DatabaseConnectionError()
    }

};