import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt";
import { userPayload } from "../services/jwt";

declare global {
  namespace Express {
    interface Request {
      currentUser?: userPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { signedCookies = {} } = req;
  const { jwt } = signedCookies;

  if (!jwt) {
    console.log(signedCookies)
    return next();
  }

  try {
    const payload = jwtService.verifyUser(jwt);
    req.currentUser = payload;
    console.log(payload)
  } catch (err) {}

  // if (!req.session?.jwt) {
  //   console.log(signedCookies)
  //   return next();
  // }

  // try {
  //   const payload = jwtService.verifyUser(req.session.jwt);
  //   req.currentUser = payload;
  // } catch (err) {}

  next();
};
