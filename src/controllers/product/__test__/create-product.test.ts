import request from "supertest";
import { app } from "../../../app";
import mongoose from 'mongoose'

it("creates a new product", async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  const {body:product} = await request(app)
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

   
});

it("return 401 if the user is not admin", async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(false))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(401);
});

it("it returns 400 with invalid name input", async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "P1",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(400);
});

it("it returns 400 with invalid missing image input", async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "P1",
      categories: categoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(400);
    
});
