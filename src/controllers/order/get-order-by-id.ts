import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Order, OrderDoc } from "../../models/order";

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;
  let order: (OrderDoc & { _id: any }) | null;

  try {
    order = await Order.findById(orderId)
  } catch (err){
    throw new DatabaseConnectionError()
  }

  if(!order){
    throw new NotFoundError()
  }

  res.status(200).send(order)

};
