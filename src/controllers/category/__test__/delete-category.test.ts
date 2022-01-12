import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("deletes a category", async () => {
    const {body:category} = await request(app)
        .post('/api/categories')
        .set('Cookie', global.signin(true))
        .send({
            name: 'laptops',
            products: []
        })
        .expect(201)

    await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Cookie', global.signin(true))
        .send()
        .expect(200)
});

it("return a 404 if the provided id does not exist", async () => {
  const categoryId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/categories/${categoryId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(404);
});
