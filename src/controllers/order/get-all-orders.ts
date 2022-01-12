import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { Order, OrderDoc } from "../../models/order";

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let orders: (OrderDoc & { _id: any })[] | null;

  try {
    orders = await Order.find();
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  res.status(200).send(orders);
};
