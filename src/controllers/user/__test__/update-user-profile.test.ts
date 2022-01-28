import request from "supertest";
import { app } from "../../../app";
import mongoose from "mongoose";

it("return a 401 if the user is not admin", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/users/updateprofile/${userId}`).send().expect(401);
});

it("get user details of all users", async () => {
  const { body: user } = await request(app)
    .post("/api/users/signup")
    .set("Cookie", global.signin(true))
    .send({
      email: "test@test.com",
      password: "12344",
    })
    .expect(201);

  const { body: userDetails } = await request(app)
    .put(`/api/users/updateprofile/${user.id}`)
    .set("Cookie", global.signin(false, user.id))
    .send({
      firstName: "John",
      lastName: "Rambo",
    })
    .expect(200);

  expect(userDetails.firstName).toEqual("John");
  expect(userDetails.lastName).toEqual("Rambo");
});
