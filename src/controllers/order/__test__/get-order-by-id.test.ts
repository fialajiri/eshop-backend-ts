import request from "supertest";
import { app } from "../../../app";
import { orderTestSetup } from "./order-test-setup";
import mongoose from "mongoose";

it("return a 404 if the provided id does not exists", async () => {
  const nonExistentOrderId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/orders/${nonExistentOrderId}`)
    .set("Cookie", global.signin(false))
    .send()
    .expect(404);
});

it("return a 401 if the the user is not authenticated", async () => {
  const nonExistentOrderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${nonExistentOrderId}`)
    .send()
    .expect(401);
});

it("return an order for provided order id", async () => {
    const {user, orderOne} = await orderTestSetup()
   

    const {body:order} = await request(app)
        .get(`/api/orders/${orderOne.order.id}`)
        .set('Cookie', global.signin(false))
        .send()
        .expect(200)

    expect(order.id).toEqual(orderOne.order.id)
    expect(order.taxPrice).toEqual(orderOne.order.taxPrice)
});
