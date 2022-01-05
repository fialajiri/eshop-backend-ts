import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeError() });
  }
  console.log(err);
  res.status(400).send({ errors: [{ message: "Něco se pokazilo" }] });
};
