import mongoose from "mongoose";
import { app } from "./app";

const PORT : string|number = process.env.PORT || 5000;

const mongoDbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oahmw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const start = async () => {
  // if (
  //   !process.env.DB_USER ||
  //   !process.env.DB_PASSWORD ||
  //   !process.env.DB_NAME
  // ) {
  //   throw new Error("DB_USER, DB_PASSWORD and DB_NAME must be defined");
  // }
  // if (
  //   !process.env.JWT_SECRET ||
  //   !process.env.JWT_EXPIRY ||
  //   !process.env.REFRESH_TOKEN_SECRET ||
  //   !process.env.REFRESH_TOKEN_EXPIRY
  // ) {
  //   throw new Error(
  //     "JWT_SECRET, JWT_EXPIRY, REFRESH_TOKEN_SECRET and REFRESH_TOKEN_EXPIRY must be defined"
  //   );
  // }

  try {
    await mongoose.connect(mongoDbUrl);
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log("Listening on port 5000.");
  });
};

start();
