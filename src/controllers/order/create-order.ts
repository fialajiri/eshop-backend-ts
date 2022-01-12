import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Address } from "../../models/address";
import { Cart, CartDoc } from "../../models/cart";
import { Order } from "../../models/order";
import { User, UserDoc } from "../../models/user";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cartId, address, paymentMethod, shippingPrice } = req.body;

  let cart: (CartDoc & { _id: any }) | null;
  let user: (UserDoc & { _id: any }) | null;
  const shippingAddress = Address.build(address);

  try {
    cart = await Cart.findById(cartId).populate("items.product");
    user = await User.findById(req.currentUser!.id);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!cart || !user) {
    throw new NotFoundError();
  }

  const newOrder = Order.build({
    user: user.id,
  });

  for (const item of cart.items) {
    newOrder.orderItems.push({
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.image[0],
      price: item.product.price,
      subtotal: item.subTotal,
      product: item.product.id,
    });
  }

  newOrder.set({
    shippingAddress,
    paymentMethod,
    taxPrice: cart.total,
    shippingPrice,
    totalPrice: cart.total + shippingPrice,
  });

  try {
    await newOrder.save();
    res.status(201).send(newOrder);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
