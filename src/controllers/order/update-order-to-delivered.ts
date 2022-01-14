import { Request, Response, NextFunction } from "express";
import { Order, OrderDoc } from "../../models/order";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { OrderStatus } from "../../models/types/order-status";

export const updateOrderToDelivered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  let order: (OrderDoc & { _id: any }) | null;

  try {
    order = await Order.findById(orderId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!order) {
    throw new NotFoundError();
  }

  order.set({
    orderStatus: OrderStatus.Delivered,
    deliveredAt: new Date(),
  });

  try {
    await order.save();
    res.status(200).send(order);
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
