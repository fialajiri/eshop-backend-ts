import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { Cart } from "../../../models/cart";
import { Product } from "../../../models/product";
import { Category } from "../../../models/category";

const setup = async () => {
  const category = Category.build({
    name: "Swiss watches",
    products: [],
  });

  await category.save();

  const product1 = Product.build({
    name: "Omega Seamaster",
    price: 4999,
    image: ["omega.image.jpg"],
    description: "A great swiss watch",
    countInStock: 10,
    categories: [category],
  });

  await product1.save();

  const product2 = Product.build({
    name: "Omega de Ville",
    price: 2999,
    image: ["omega.image.jpg"],
    description: "A great swiss watch",
    countInStock: 10,
    categories: [category],
  });

  await product2.save();

  const cart = Cart.build({});

  await cart.save();

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product1.id,
      quantity: 5,
    })
    .expect(200);

  return { product1, cart, product2 };
};

it("returns a 404 if the product does not exists", async () => {
  const { cart } = await setup();
  const nonExistentProductId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/cart/subtractfromcart/${cart.id}`)
    .send({
      productId: nonExistentProductId,
      quantity: 1,
    })
    .expect(404);
});

it("returns a 400 if the product is not in the cart", async () => {
  const { cart, product2 } = await setup();

  await request(app)
    .put(`/api/cart/subtractfromcart/${cart.id}`)
    .send({
      productId: product2.id,
      quantity: 1,
    })
    .expect(400);
});

it("returns a 404 if the cart does not exists", async () => {
  const { product1 } = await setup();
  const nonExistentCartId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/cart/subtractfromcart/${nonExistentCartId}`)
    .send({
      productId: product1.id,
      quantity: 1,
    })
    .expect(404);
});

it("returns a 400 if the subtracted quantity is greater than the quantity in the cart", async () => {
  const { product1, cart } = await setup();

  await request(app)
    .put(`/api/cart/subtractfromcart/${cart.id}`)
    .send({
      productId: product1.id,
      quantity: 7,
    })
    .expect(400);
});

it("subtract a product quantity from the cart and restores the availability", async () => {
  const { product1, cart } = await setup();

  const { body: updatedCart } = await request(app)
    .put(`/api/cart/subtractfromcart/${cart.id}`)
    .send({
      productId: product1.id,
      quantity: 1,
    })
    .expect(200);

  expect(updatedCart.items[0].quantity).toEqual(4);
  expect(updatedCart.items[0].product.availability).toEqual(6);
});

it("removes the item from the cart if the subtracted quantity is equal to quantity in cart", async () => {
  const { product1, cart } = await setup();

  const { body: updatedCart } = await request(app)
    .put(`/api/cart/subtractfromcart/${cart.id}`)
    .send({
      productId: product1.id,
      quantity: 5,
    })
    .expect(200);

  expect(updatedCart.items.length).toEqual(0);
});
