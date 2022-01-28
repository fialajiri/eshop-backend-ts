import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { User, UserDoc } from "../../models/user";
import { jwtService, userPayload } from "../../services/jwt";
import { COOKIE_OPTIONS } from "../../app";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let existingUser: (UserDoc & { _id: any }) | null;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (existingUser) {
    throw new BadRequestError(
      "Uživatel s tímto emailem již existuje. Zkuste se přihlásit"
    );
  }

  const newUser = User.build({
    email,
    password,
    isAdmin: false,
  });

  await newUser.save();

  const payload = {
    id: newUser.id,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  } as userPayload;

  const userJwt = jwtService.getToken(payload);

  req.session = {
    jwt: userJwt,
  };

  
  res.status(201).cookie("jwt", userJwt, COOKIE_OPTIONS).send(newUser);
};

export default signUp;
