import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { Cart } from "../../../models/cart";

it("return an existing cart from db for provided id", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cart = Cart.build({});
  cart.set({ user: userId });
  await cart.save();

  const { body: usersCart } = await request(app)
    .get(`/api/cart/${cart.id}`)
    .send()
    .expect(200);

  expect(usersCart.user).toEqual(userId);
});

it("return a new cart if there is no cart for provided id", async () => {
  const cartId = new mongoose.Types.ObjectId().toHexString();

  const { body: newCart } = await request(app)
    .get(`/api/cart/${cartId}`)
    .send({
      cartId,
    })
    .expect(201);

  expect(newCart.user).toEqual(undefined);
});
