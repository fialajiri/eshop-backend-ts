import { Request, Response, NextFunction, request } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Cart, CartDoc } from "../../models/cart";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    const newCart = Cart.build({});
    await newCart.save();
    res.status(201).send(newCart);
  } else {
    const userId = req.currentUser.id;
    let usersCart: (CartDoc & { _id: any }) | null;

    try {
      usersCart = await Cart.findOne({ user: userId });
    } catch (err) {
      throw new DatabaseConnectionError();
    }

    if (!usersCart) {
      const newCart = Cart.build({});
      newCart.set({ user: userId });
      await newCart.save();
      res.status(201).send(newCart);
    } else {
      res.status(200).send(usersCart);
    }
  }
};
