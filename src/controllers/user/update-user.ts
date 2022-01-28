import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { User, UserDoc } from "../../models/user";

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  let user: (UserDoc & { _id: any }) | null;
  const { userId } = req.params;

  try {
    user = await User.findById(userId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!user) {
    throw new NotFoundError();
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.isAdmin = req.body.isAdmin;

  try {
    await user.save();
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  const userDetails = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
    addresses: user.addresses,
  };

  res.status(200).send(userDetails);
};

export default updateUser;
