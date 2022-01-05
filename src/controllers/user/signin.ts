import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { User } from "../../models/user";
import { jwtService, userPayload } from "../../services/jwt";
import { Password } from "../../services/password";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

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

  req.session = {
    jwt: userJwt,
  };

  res.status(200).send(existingUser);
};

export default signIn;
