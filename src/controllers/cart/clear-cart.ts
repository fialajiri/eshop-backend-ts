import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Cart, CartDoc } from "../../models/cart";


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
    await cart.clearCart();
    res.status(200).send(cart);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
