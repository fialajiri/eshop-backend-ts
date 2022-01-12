import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Cart, CartDoc } from "../../models/cart";
import { Product } from "../../models/product";

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cartId } = req.params;

  let cart: (CartDoc & { _id: any }) | null;

  try {
    cart = await Cart.findById(cartId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!cart) {
    throw new NotFoundError();
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    for (const item of cart.items) {
      const productId = item.product._id;
      const productQuantity = item.quantity;

      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError();
      }

      product.set({ availability: product.availability + productQuantity });
      await product.save();
    }
    cart.set({ items: [] });
    await session.commitTransaction();
    res.status(200).send(cart);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
