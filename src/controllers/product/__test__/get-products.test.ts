import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";
import { Category } from "../../../models/category";

const createProductOne = async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();
  const category = Category.build({
    name: "omega",
    products: [],
  });

  await category.save();

  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Rolex Watch",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is Rolex Watch. It is very good",
      price: 199,
      countInStock: 10,
    });
};

const createProductTwo = async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();
  const category = Category.build({
    name: "rolex",
    products: [],
  });

  await category.save();

  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Omega Watch",
      image: ["image1.jpg", "image2.jpg"],
      categories: categoryId,
      description: "This is Omega Watch. It is very good",
      price: 199,
      countInStock: 10,
    });
};

it("can fetch a list of products", async () => {
  await createProductOne();
  await createProductOne();
  await createProductOne();

  const response = await request(app).get("/api/products").send({}).expect(200);

  expect(response.body.products.length).toEqual(3);
});

it("can fetch product by category", async () => {
  await createProductOne();
  await createProductTwo();

  const response = await request(app)
    .get("/api/products?category=omega")
    .send({})
    .expect(200);

  expect(response.body.products.length).toEqual(1);
  expect(response.body.products[0].name).toEqual("Omega Watch");
});

it("can fetch product by search parametr", async () => {
  await createProductOne();
  await createProductTwo();

  const response = await request(app)
    .get("/api/products?keyword=rolex")
    .send({})
    .expect(200);

  expect(response.body.products.length).toEqual(1);
  expect(response.body.products[0].name).toEqual("Rolex Watch");
});
