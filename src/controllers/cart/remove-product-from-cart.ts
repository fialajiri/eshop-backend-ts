import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Product, ProductDoc } from "../../models/product";
import { Cart, CartDoc } from "../../models/cart";
import { NotFoundError } from "../../errors/not-found-error";
import { BadRequestError } from "../../errors/bad-request-error";
import mongoose from "mongoose";

export const removeProductFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.body;
  const { cartId } = req.params;

  let cart: (CartDoc & { _id: any }) | null;
  let product: (ProductDoc & { _id: any }) | null;

  try {
    cart = await Cart.findById(cartId);
    product = await Product.findById(productId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!cart || !product) {
    throw new NotFoundError();
  }

  const cartProductIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === product!.id
  );

  if (cartProductIndex < 0) {
    throw new BadRequestError("Daný product již není v košíku");
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    product.set({
      availability:
        product.availability + cart.items[cartProductIndex].quantity,
    });
    await product.save();
    await cart.removeFromCart(productId);
    await cart.populate("items.product");
    await session.commitTransaction();
    res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    throw new DatabaseConnectionError();
  }
};