import request from "supertest";
import { app } from "../../../app";

import { orderTestSetup } from "./order-test-setup";

it("returns 401 if hte user is not admim", async () => {
  await request(app).get("/api/orders").send().expect(401);
});

it("can fetch list of orders", async () => {
  const { user } = await orderTestSetup();

  const { body: listOfOrders } = await request(app)
    .get("/api/orders")
    .set("Cookie", global.signin(true, user.id))
    .expect(200);

  expect(listOfOrders.length).toEqual(2);
});
