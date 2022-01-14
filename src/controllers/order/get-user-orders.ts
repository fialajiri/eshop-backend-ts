import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Order, OrderDoc } from "../../models/order";

export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.currentUser!.id;
  let orders: (OrderDoc & { _id: any })[] | null;

  try {
    orders = await Order.find({ user: userId });
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  res.status(200).send(orders)

};
