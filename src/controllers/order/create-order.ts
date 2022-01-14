import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Address } from "../../models/address";
import { Cart, CartDoc } from "../../models/cart";
import { Order } from "../../models/order";
import { User, UserDoc } from "../../models/user";
import mongoose from "mongoose";
import { Product } from "../../models/product";
import { BadRequestError } from "../../errors/bad-request-error";

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

 

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    for (const orderItem of newOrder.orderItems) {
      const product = await Product.findById(orderItem.product);
      if (!product) {
        throw new NotFoundError();
      }

      if (product.availability < orderItem.quantity) {
        // TO-DO: Update the quantity in cart to available quantity

        throw new BadRequestError(
          `Produkt ${orderItem.name} již není dostupný v požadovaném množství. Počet dostupných kusů: ${product.availability}`
        );
      }

      product.set({ availability: product.availability - orderItem.quantity });
      await product.save({ session: session });
    }

    await newOrder.save({ session: session });
    cart.set({ items: [], total: 0 });
    await cart.save({ session: session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).send({ order: newOrder, cart: cart });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    if (err instanceof NotFoundError) {
      throw err;
    }
    if (err instanceof BadRequestError) {
      throw err;
    }
    throw new DatabaseConnectionError();
  }
};
