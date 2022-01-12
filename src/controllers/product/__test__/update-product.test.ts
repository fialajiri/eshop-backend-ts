import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("return a 404 the provided id does not exist", async () => {
  const productId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1v2",
      image: ["image1.jpg", "image2.jpg"],
      categories: "Category 2",
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: 100,
    })
    .expect(404);
});
it("return a 401 if the user is not admin", async () => {
  const productId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(false))
    .send({
      name: "Product1v2",
      image: ["image1.jpg", "image2.jpg"],
      categories: "Category 2",
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: 100,
    })
    .expect(401);
});
it("it return a 400 if the user provides invalid inputs", async () => {
  const productId = new mongoose.Types.ObjectId().toHexString();
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
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

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1v2",
      image: [],
      categories: categoryId,
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1v2",
      image: ["image1.jpg", "image2.jpg"],
      categories: "",
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1v2",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "",
      price: 299,
      countInStock: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1v2",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is product 1. It is excellent quality",
      price: -299,
      countInStock: 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1v2",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: -100,
    })
    .expect(400);
});
it("it updates the product provided valid inputs", async () => {
  const productId = new mongoose.Types.ObjectId().toHexString();
  const oldCategoryId = new mongoose.Types.ObjectId().toHexString();
  const newCategoryId = new mongoose.Types.ObjectId().toHexString();
  

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      categories: oldCategoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/products/${productId}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "",
      image: ["image1.jpg", "image2.jpg"],
      categories: newCategoryId,
      description: "This is product 1. It is excellent quality",
      price: 299,
      countInStock: 100,
    })
    .expect(400);
});
