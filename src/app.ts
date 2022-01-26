import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler";
import { currentUser } from "./middlewares/current-user";
import { NotFoundError } from "./errors/not-found-error";
import { userRoutes } from "./routes/user-routes";
import { productRoutes } from "./routes/product-routes";
import { categoryRoutes } from "./routes/category-routes";
import { cartRoutes } from "./routes/cart-routes";
import { OrderRoutes } from "./routes/order-routes";
import { uploadRoutes } from "./routes/upload-routes";
import cookieParser from 'cookie-parser'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: true,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY!) * 1000,
  
};

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SECRET));

// app.use(
//   cookieSession({
//     signed: false,
//     secure: true,
//     httpOnly: true,
//   })
// );

app.use(currentUser);

app.use(userRoutes);
app.use(productRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(OrderRoutes);
app.use(uploadRoutes);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
