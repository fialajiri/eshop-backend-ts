import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

import getCurrentUser from "../controllers/user/current-user";
import deleteUser from "../controllers/user/delete-user";
import getAllUsers from "../controllers/user/get-all-users";
import updateUserProfile from "../controllers/user/update-user-profile";
import updateUser from "../controllers/user/update-user";
import getUserDetails from "../controllers/user/get-user-details";
import signIn from "../controllers/user/signin";
import signUp from "../controllers/user/signup";
import signOut from "../controllers/user/signout";

import {requireAuth} from '../middlewares/require-auth'
import { requireAdmin } from "../middlewares/require-admin";


const router = express.Router();

router.get("/api/users/currentuser", getCurrentUser);

router.get('/api/users/getallusers',requireAdmin, getAllUsers);

router.get('/api/users/:userId',requireAuth, getUserDetails);

router.delete('/api/users/:userId', requireAdmin,  deleteUser);

router.put('/api/users/updateprofile/:userId', requireAuth, updateUserProfile)

router.put('/api/users/:userId', requireAdmin, updateUser)

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
