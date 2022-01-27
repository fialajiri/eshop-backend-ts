import { Request, Response, NextFunction } from "express";
import { DatabaseConnectionError } from "../../errors/database-connection-error";
import { NotFoundError } from "../../errors/not-found-error";
import { User, UserDoc } from "../../models/user";

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  let user: (UserDoc & { _id: any }) | null;

  
  try {
    user = await User.findById(userId);
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  if (!user) {
    throw new NotFoundError();
  }

  try {
    await user.remove();
    res.status(200).send();
  } catch (err) {
    throw new DatabaseConnectionError("Nepodařilo se smazat uživatele");
  }

  res.send();
};

export default deleteUser;
