import request from "supertest";
import { app } from "../../../app";
import { Category } from "../../../models/category";
import { Product } from "../../../models/product";

const setup = async () => {
  const { body: category1 } = await request(app)
    .post("/api/categories")
    .set("Cookie", global.signin(true))
    .send({
      name: "furniture",
      products: [],
    })
    .expect(201);

  const { body: category2 } = await request(app)
    .post("/api/categories")
    .set("Cookie", global.signin(true))
    .send({
      name: "tables",
      products: [],
    })
    .expect(201);

  const { body: product } = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      categories: [category1.id, category2.id],
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(201);

  return { category1, category2, product };
};

it("creates categories and assigns them to newly created product", async () => {
  const { category1, category2, product } = await setup();

  expect(product.categories.length).toEqual(2);
});

it("asserts that the newly created product has been assigned to its categories", async () => {
  let { category1, category2, product } = await setup();

  category1 = await Category.findById(category1.id);
  category2 = await Category.findById(category2.id);

  expect(category1.products.length).toEqual(1);
  expect(category1.products[0]._id.toString()).toEqual(product.id);
  expect(category2.products.length).toEqual(1);
  expect(category2.products[0]._id.toString()).toEqual(product.id);
});

it("updates existing product by adding some and removing other categories", async () => {
  const { category1, category2, product } = await setup();

  const { body: newCategory } = await request(app)
    .post("/api/categories")
    .set("Cookie", global.signin(true))
    .send({
      name: "armchair",
      products: [],
    })
    .expect(201);

  const { body: updatedProduct } = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", global.signin(true))
    .send({
      name: "Product1",
      image: ["image1.jpg", "image2.jpg"],
      categories: [newCategory.id],
      description: "This is product 1. It is very good",
      price: 199,
      countInStock: 10,
    })
    .expect(200);

  expect(updatedProduct.categories.length).toEqual(1);
  expect(updatedProduct.categories[0]).toEqual(newCategory.id);
});

it("deletes a product and remove its reference from its categories", async () => {
  let { category1, category2, product } = await setup();

  await request(app)
    .delete(`/api/products/${product.id}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);

  category1 = await Category.findById(category1.id);
  category2 = await Category.findById(category2.id);

  expect(category1.products.length).toEqual(0);
  expect(category2.products.length).toEqual(0);
});

it("deletes a category and remove its reference form its product", async () => {
  let { category1, category2, product } = await setup();

  await request(app)
    .delete(`/api/categories/${category1.id}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);

  product = await Product.findById(product.id);

  expect(product.categories.length).toEqual(1);
});
