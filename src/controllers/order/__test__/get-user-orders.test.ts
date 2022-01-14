import request from "supertest";
import { app } from "../../../app";
import { orderTestSetup } from "./order-test-setup";

it("returns a 401 if the user is not authenticated", async () => {
  {
    await request(app).get("/api/orders/myorders").send().expect(401);
  }
});

it("return a list of orders for current user", async () => {
  const { user } = await orderTestSetup();

  const { body: listOfOrders } = await request(app)
    .get("/api/orders/myorders")
    .set("Cookie", global.signin(false, user.id))
    .send()
    .expect(200);

  expect(listOfOrders[0].user).toEqual(user.id);
});

it("return an empty object if the user has no orders", async () => {
  const { body: listOfOrders } = await request(app)
    .get("/api/orders/myorders")
    .set("Cookie", global.signin(false))
    .send()
    .expect(200);

  expect(listOfOrders.length).toEqual(0);
});
