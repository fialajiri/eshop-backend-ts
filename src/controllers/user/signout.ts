import { Request, Response, NextFunction } from "express";
import {COOKIE_OPTIONS} from '../../app'

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  res.cookie("jwt", '', COOKIE_OPTIONS)
  res.send({});
};

export default signOut;
