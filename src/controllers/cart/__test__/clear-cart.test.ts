import request from "supertest";
import { app } from "../../../app";
import { Cart } from "../../../models/cart";
import { Category } from "../../../models/category";
import { Product } from "../../../models/product";
import mongoose from "mongoose";

it("returns a 404 if the cart does not exists", async () => {
  const nonExistentCartId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/cart/clearcart/${nonExistentCartId}`)
    .send({})
    .expect(404);
});

it("it removes all items from the cart", async () => {
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

  await request(app)
    .put(`/api/cart/addtocart/${cart.id}`)
    .send({
      productId: product2.id,
      quantity: 2,
    })
    .expect(200);

  const { body: updatedCart } = await request(app)
    .put(`/api/cart/clearcart/${cart.id}`)
    .send({})
    .expect(200);

  expect(updatedCart.items.length).toEqual(0);

  

  

});
