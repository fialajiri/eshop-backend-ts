import request from "supertest";
import { app } from "../../../app";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { Address } from "../../../models/address";
import { PaymentMethods } from "../../../models/types/payment-method";
import { OrderStatus } from "../../../models/types/order-status";

const setup = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = new Order({
    user: userId,
  });

  const address = Address.build({
    firstName: "Jiri",
    lastName: "Fiala",
    phone: "602107243",
    street: "Karoliny Svetle",
    streetNumber: "1794/1",
    city: "Teplice",
    postal: "41501",
  });

  order.set({
    shippingAddress: address,
    paymentMethod: PaymentMethods.BANK_TRANSFER,
    taxPrice: 1000,
    totalPrice: 1000,
  });

  await order.save();

  return order;
};

it("return a 401 if the user is not admin", async () => {
  const order = await setup();
  await request(app).put(`/api/orders/delivered/${order.id}`).send().expect(401);
});

it("return a 404 if the order does not exists", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/orders/delivered/${orderId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(404);
});

it("updates an order to paid", async () => {
  const order = await setup();
  const { body: deliveredOrder } = await request(app)
    .put(`/api/orders/delivered/${order.id}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);

  expect(deliveredOrder.orderStatus).toEqual(OrderStatus.DELIVERED);
  expect(deliveredOrder.deliveredAt).toBeDefined();
});