import crypto, { pbkdf2 } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(pbkdf2);

const NUMBER_OF_ITERATIONS = 10000;
const KEYLEN = 64;
const ALGORITHM = "sha512";

export class Password {
  static async generatePassword(password: string) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = (
      await scryptAsync(password, salt, NUMBER_OF_ITERATIONS, KEYLEN, ALGORITHM)
    ).toString("hex");

    return `${hash}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    const hastVerify = (
      await scryptAsync(
        suppliedPassword,
        salt,
        NUMBER_OF_ITERATIONS,
        KEYLEN,
        ALGORITHM
      )
    ).toString("hex");

    return hashedPassword === hastVerify;
  }
}
