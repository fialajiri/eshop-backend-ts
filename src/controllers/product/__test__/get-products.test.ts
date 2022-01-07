import request from "supertest";
import { app } from "../../../app";
import mongoose from 'mongoose'
import { Category } from "../../../models/category";

const createProduct = async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString()
  const category = Category.build({
    name: "Category 1",
    products: [],
  });

  await category.save();

  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      category: categoryId,
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    });
};

it("can fetch a list of products", async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app).get("/api/products").send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
