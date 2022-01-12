import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Cart, CartDoc } from "../../models/cart";

export const getCartById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cartId = req.params.cartId;

  let cart: (CartDoc & { _id: any }) | null;

  try {
    cart = await Cart.findById(cartId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!cart) {
    const newCart = Cart.build({});
    await newCart.save();
    res.status(201).send(newCart);
  } else {
    res.status(200).send(cart);
  }
};
