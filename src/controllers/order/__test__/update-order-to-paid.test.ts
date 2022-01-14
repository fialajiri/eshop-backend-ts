import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

import { OrderStatus } from "../../../models/types/order-status";
import { orderTestSetup } from "./order-test-setup";
import { Product } from "../../../models/product";


it("return a 401 if the user is not admin", async () => {
  const { orderOne } = await orderTestSetup();

  await request(app).put(`/api/orders/pay/${orderOne.order.id}`).send().expect(401);
});

it("return a 404 if the order does not exists", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/orders/pay/${orderId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(404);
});

it("updates an order to paid", async () => {
  const {
    orderOne: { order },
  } = await orderTestSetup();

  const { body: paidOrder } = await request(app)
    .put(`/api/orders/pay/${order.id}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);

  expect(paidOrder.orderStatus).toEqual(OrderStatus.Paid);
  expect(paidOrder.paidAt).toBeDefined();
});


it('updates order to paid and decreses product count in stock by ordered quantity', async() => {
  const {
    orderOne: { order }, product
  } = await orderTestSetup();

  const { body: paidOrder } = await request(app)
    .put(`/api/orders/pay/${order.id}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);

  expect(paidOrder.orderStatus).toEqual(OrderStatus.Paid);
  expect(paidOrder.paidAt).toBeDefined();

  const updatedProduct = await Product.findById(product.id)  
  expect(updatedProduct!.countInStock).toEqual(5)

});
