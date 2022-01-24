import { Request, Response, NextFunction } from "express";

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send();
};

export default deleteUser;
