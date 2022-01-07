import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("return a 404 if the provided id does not exists", async () => {
  const productId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .expect(404);
});

it("fetches a product given the valid id", async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString()

  const { body: savedProduct } = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      category: categoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(201);

  const productId = savedProduct.id;

  const { body: requestedProduct } = await request(app)
    .get(`/api/products/${productId}`)
    .send()
    .expect(200);

  expect(requestedProduct).not.toBeNull();
});
