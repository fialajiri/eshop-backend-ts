import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("return a 401 if the user is not admin", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/users/getallusers`)
    .set("Cookie", global.signin(false))
    .send()
    .expect(401);
});

it("get a list of all users", async () => {
  await request(app)
    .post("/api/users/signup")
    .set("Cookie", global.signin(true))
    .send({
      email: "test@test.com",
      password: "12344",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .set("Cookie", global.signin(true))
    .send({
      email: "test2@test.com",
      password: "1234444",
    })
    .expect(201);

  const { body: users } = await request(app)
    .get(`/api/users/getallusers`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);

  expect(users.length).toEqual(2);
});
