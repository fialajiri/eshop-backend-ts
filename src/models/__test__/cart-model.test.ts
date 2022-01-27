import request from "supertest";
import { app } from "../../app";
import { Cart } from "../cart";
import { Product } from "../product";
import mongoose from "mongoose";

const createProduct = async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  const { body: product } = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(201);

  return product;
};

it("build an empty cart", async () => {
  const cart = Cart.build({});
  expect(cart).toBeDefined();
});

it("adds products to the cart", async () => {
  const product1 = await createProduct();
  const product2 = await createProduct();

  const cart = Cart.build({});

  await cart.addToCart(product1, 1);
  await cart.addToCart(product1, 1);
  await cart.addToCart(product2, 2);

  expect(cart.items.length).toEqual(2);  
});
it("removes product from cart", async () => {
  const product = await createProduct();
  const cart = Cart.build({});

  await cart.addToCart(product, 5);
  await cart.removeFromCart(product.id);

  expect(cart.items.length).toEqual(0);
});

it("decrement the quantity", async () => {
  const product = await createProduct();
  const cart = Cart.build({});

  await cart.addToCart(product, 5);
  await cart.subtractFromCart(product, 2);

  expect(cart.items[0].quantity).toEqual(3);
});


