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
  const userID = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(false, userID);

  const cart = Cart.build({});
  cart.set({ user: userID });
  await cart.save();

  const { body: usersCart } = await request(app)
    .get("/api/cart")
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(usersCart.id).toEqual(cart.id);
  expect(cart.user).not.toBeNull();
});
