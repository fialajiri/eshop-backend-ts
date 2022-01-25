import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import cors from 'cors'

import { errorHandler } from "./middlewares/error-handler";
import { currentUser } from "./middlewares/current-user";

import { NotFoundError } from "./errors/not-found-error";
import { userRoutes } from "./routes/user-routes";
import { productRoutes } from "./routes/product-routes";
import { categoryRoutes } from "./routes/category-routes";
import { cartRoutes } from "./routes/cart-routes";
import { OrderRoutes } from "./routes/order-routes";
import { uploadRoutes } from "./routes/upload-routes";

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

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
app.use(cartRoutes);
app.use(OrderRoutes);
app.use(uploadRoutes)

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
