import { Request, Response, NextFunction } from "express";
import { User, UserDoc } from "../../models/user";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { NotAuthorizedError } from "../../errors/not-authorized-erros";

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  let user: (UserDoc & { _id: any }) | null;
  const { userId } = req.params;

  if (userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

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
  if (req.body.password) {
    user.password = req.body.password;
  }

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

export default updateUserProfile;
