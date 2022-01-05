import { Request, Response, NextFunction } from "express";

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.send({});
};

export default signOut;
