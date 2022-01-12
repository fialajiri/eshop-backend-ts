import request from "supertest";
import { app } from "../../../app";
import { Category } from "../../../models/category";

it("creates new category", async () => {
  await request(app)
    .post("/api/categories")
    .set("Cookie", global.signin(true))
    .send({
      name: "notebooks",
    })
    .expect(201);
});

it("return a 404 if the user is not admin", async () => {
  await request(app)
    .post("/api/categories")
    .send({
      name: "notebooks",
    })
    .expect(401);
});

it("it return 400 with invalid inputs", async () => {
  await request(app)
    .post("/api/categories")
    .set("Cookie", global.signin(true))
    .send({
      name: "",
    })
    .expect(400);
});
