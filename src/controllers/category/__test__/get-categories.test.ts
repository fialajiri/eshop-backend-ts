import request from "supertest";
import { app } from "../../../app";
import { Category } from "../../../models/category";

it("returns a list of categories", async () => {
  const category1 = Category.build({
    name: "furniture",
    products: [],
  });

  await category1.save();

  const category2 = Category.build({
    name: "tables",
    products: [],
  });

  await category2.save();

  const response = await request(app)
    .get("/api/categories/")
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});
