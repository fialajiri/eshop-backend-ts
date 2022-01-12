import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Cart, CartDoc } from "../../models/cart";
import { Product, ProductDoc } from "../../models/product";
import mongoose from "mongoose";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, quantity } = req.body;
  const { cartId } = req.params;

  let cart: (CartDoc & { _id: any }) | null;
  let product: (ProductDoc & { _id: any }) | null;

  try {
    cart = await Cart.findById(cartId);
    product = await Product.findById(productId);
  } catch (err) {
    console.log(err);
    throw new DatabaseConnectionError();
  }

  if (!cart || !product) {
    throw new NotFoundError();
  }

  if (product.availability < quantity) {
    throw new BadRequestError("Nelze přidat větší než dostupné množství");
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    product.set({ availability: product.availability - quantity });
    await product.save();
    await cart.addToCart(product, quantity);
    await cart.populate("items.product");
    await session.commitTransaction();
    res.status(200).send(cart);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
