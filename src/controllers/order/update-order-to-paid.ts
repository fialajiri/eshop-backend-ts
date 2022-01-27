import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Order, OrderDoc } from "../../models/order";
import { Product } from "../../models/product";
import { OrderStatus } from "../../models/types/order-status";
import mongoose from "mongoose";

export const updateOrderToPaid = async (
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
    orderStatus: OrderStatus.PAID,
    paidAt: new Date(),
  });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    for (const orderItem of order.orderItems) {
      await Product.updateOne(
        { _id: orderItem.product._id },
        { $inc: { countInStock: -orderItem.quantity } },
        { session: session }
      );
    }

    await order.save({ session: session });
    await session.commitTransaction();
    res.status(200).send(order);
  } catch (err) {
    throw new DatabaseConnectionError();
  } finally {
    session.endSession();
  }
};
