import { Request, Response, NextFunction } from "express";

const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send();
};

export default getUserDetails;