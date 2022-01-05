import { Request, Response, NextFunction } from "express";

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send({ currentUser: req.currentUser || null });
};

export default getCurrentUser;
