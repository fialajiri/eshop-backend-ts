import { Request, Response, NextFunction, response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { User, UserDoc } from "../../models/user";
import { jwtService, userPayload } from "../../services/jwt";
import { Password } from "../../services/password";
import { COOKIE_OPTIONS } from "../../app";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let existingUser: (UserDoc & { _id: any }) | null;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!existingUser) {
    throw new BadRequestError("Neplatné přístupové údaje");
  }

  const passwordMatch = await Password.compare(existingUser.password, password);

  if (!passwordMatch) {
    throw new BadRequestError("Neplatné přístupové údaje");
  }

  const payload: userPayload = {
    id: existingUser.id,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  };

  const userJwt = jwtService.getToken(payload);

  res.status(200).cookie("jwt", userJwt, COOKIE_OPTIONS).send(existingUser);
};

export default signIn;
