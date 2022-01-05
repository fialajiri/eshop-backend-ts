import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

import getCurrentUser from "../controllers/user/current-user";
import signIn from "../controllers/user/signin";
import signUp from "../controllers/user/signup";
import signOut from "../controllers/user/signout";

const router = express.Router();

router.get("/api/users/currentuser", getCurrentUser);

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Zadejte platný email."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Heslo musí mít mezi 4 a 20 znaky."),
  ],
  validateRequest,
  signUp
);

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Zadejte platný email."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Heslo nesmí být prázdné."),
  ],
  validateRequest,
  signIn
);

router.post("/api/users/signout", signOut);

export { router as userRoutes };
