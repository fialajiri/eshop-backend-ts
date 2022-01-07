import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler } from "./middlewares/error-handler";
import { currentUser } from "./middlewares/current-user";

import { NotFoundError } from "./errors/not-found-error";
import { userRoutes } from "./routes/user-routes";
import { productRoutes } from "./routes/product-routes";
import { categoryRoutes } from "./routes/category-routes";

const app = express();

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    httpOnly: true,
  })
);

app.use(currentUser);

app.use(userRoutes);
app.use(productRoutes);
app.use(categoryRoutes);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
