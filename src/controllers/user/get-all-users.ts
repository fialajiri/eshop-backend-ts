import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { User, UserDoc } from "../../models/user";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  let users: (UserDoc & { _id: any })[] | null;

  try {
    users = await User.find();
  } catch (err) {    
    throw new DatabaseConnectionError();
  }

  res.status(200).send(users);
};

export default getAllUsers;
