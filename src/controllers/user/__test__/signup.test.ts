import request from "supertest";
import { app } from "../../../app";

it("returns 201 on successful login", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);
});

it("return a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "notValidEmail",
      password: "123456",
    })
    .expect(400);
});

it("return a 400 witn an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "12",
    })
    .expect(400);
});

it("return 400 with missing email and password", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows a duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
