import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("return a 404 if the provided id does not exists", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/users/${userId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(404);
});

it("deletes a user", async () => {
  

  const { body: user } = await request(app)
    .post("/api/users/signup")
    .set("Cookie", global.signin(true))
    .send({
      email: "test@test.com",
      password: '12344'
    })
    .expect(201);
   

  const userId = user.id;

  await request(app)
    .delete(`/api/users/${userId}`)
    .set("Cookie", global.signin(true))
    .send()
    .expect(200);
});