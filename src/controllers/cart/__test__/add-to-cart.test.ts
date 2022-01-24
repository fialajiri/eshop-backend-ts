import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { Cart } from "../../../models/cart";
import { Product } from "../../../models/product";
import { Category, CategoryDoc } from "../../../models/category";

const setup = async () => {
  const category = Category.build({
    name: "Swiss watches",
    products: [],
  });

  await category.save();

  const product = Product.build({
    name: "Omega Seamaster",
    price: 4999,
    image: ["omega.image.jpg"],
    description: "A great swiss watch",
    countInStock: 10,
    categories: [category],
  });

  await product.save();

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

  return { product, cart, product2 };
};

it("returns a 404 if the product does not exists", async () => {
  const { cart } = await setup();
  const nonExistentProductId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: nonExistentProductId,
      quantity: 1,
    })
    .expect(404);
});

it("returns a 400 if the quantity exceed the quantity in stock", async () => {
  const { product, cart } = await setup();
  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product.id,
      quantity: 100,
    })
    .expect(400);
});

it("returns a 404 if the cart does not exists", async () => {
  const { product } = await setup();
  const nonExistentCartId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/cart/addtocart/${nonExistentCartId}`)
    .send({
      productId: product.id,
      quantity: 1,
    })
    .expect(404);
});

it("add a new item to the cart", async () => {
  const { product, cart, product2 } = await setup();

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product2.id,
      quantity: 2,
    })
    .expect(200);

  const { body: updatedCart } = await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product.id,
      quantity: 1,
    })
    .expect(200);

  expect(updatedCart.items.length).toEqual(2);
  expect(updatedCart.items[1].product).toEqual(product.id);
});

it("increse the quantity of existing item", async () => {
  const { product, cart } = await setup();

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product.id,
      quantity: 1,
    })
    .expect(200);

  const { body: updatedCart } = await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product.id,
      quantity: 1,
    })
    .expect(200);

  expect(updatedCart.items[0].quantity).toEqual(2);
});
