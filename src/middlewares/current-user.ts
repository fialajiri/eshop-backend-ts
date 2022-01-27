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

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const { cookies = {} } = req;
  let { jwt } = cookies;
  // the next line only for testing with jest
  if (!jwt && cookies.cookie) jwt = JSON.parse(cookies.cookie).jwt;
  
  

  if (!jwt) {   
    return next();
  }

  try {
    const payload = jwtService.verifyUser(jwt);
    req.currentUser = payload;
  } catch (err) {}

  // if (!req.session?.jwt) {   
  //   return next();
  // }

  // try {
  //   const payload = jwtService.verifyUser(req.session.jwt);
  //   req.currentUser = payload;
  // } catch (err) {}

  next();
};
