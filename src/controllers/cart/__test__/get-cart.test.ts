import request from "supertest";
import { app } from "../../../app";
import { Cart } from "../../../models/cart";
import { userPayload } from "../../../services/jwt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

it("return new cart for unsigned user without cart id from local storage", async () => {
  const { body: cart } = await request(app).get("/api/cart").send().expect(201);

  expect(cart.id).toBeDefined();
});

it("for cookie authenticated user finds his cart and returs it", async () => {
  const user = global.signin(false);

  const token = user[0].split("=")[1];
  var payload = JSON.parse(Buffer.from(token, "base64").toString());
  const decodedPayload = jwt.decode(payload.jwt) as userPayload;

  const cart = Cart.build({});
  cart.set({ user: decodedPayload.id });
  await cart.save();

  const { body: usersCart } = await request(app)
    .get("/api/cart")
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(usersCart.id).toEqual(cart.id);
  expect(cart.user).not.toBeNull();
});
