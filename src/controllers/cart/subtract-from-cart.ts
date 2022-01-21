import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Product, ProductDoc } from "../../models/product";
import { Cart, CartDoc } from "../../models/cart";
import { NotFoundError } from "../../errors/not-found-error";
import { BadRequestError } from "../../errors/bad-request-error";
import mongoose from "mongoose";

export const subtractFromCart = async (
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

  if (cart.items[cartProductIndex].quantity < quantity) {
    throw new BadRequestError(
      "Nelze odstranit větší množství než, které je v košíku"
    );
  }

  try {
    await cart.subtractFromCart(product, quantity);    
    res.status(200).send(cart);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
