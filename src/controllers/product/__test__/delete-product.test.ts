import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("return a 404 if the provided id does not exists", async () => {
  const productId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(404);
});

it("deletes a product", async () => {
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

  const productId = product.id;

  await request(app)
    .delete(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);
});
