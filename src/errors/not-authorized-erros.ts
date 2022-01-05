import { CustomError } from "./custom-errors";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Pro tuto operaci nemáte oprávnění");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
