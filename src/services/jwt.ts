import jwt from "jsonwebtoken";

export interface userPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

export class jwtService {
  static getToken(payload: userPayload) {
    const expiresIn = eval(process.env.JWT_EXPIRY!);
    const secret = process.env.JWT_SECRET!;
    

    return jwt.sign(payload, secret, { expiresIn: expiresIn });
  }

  static getRefreshToken(payload: userPayload) {
    const expiresIn = eval(process.env.REFRESH_TOKEN_EXPIRY!);
    const secret = process.env.REFRESH_TOKEN_SECRET!;

    return jwt.sign(payload, secret, { expiresIn: expiresIn });
  }

  static verifyUser(jwtToken: string) {
    const secret = process.env.JWT_SECRET!;
    return jwt.verify(jwtToken, secret) as userPayload;

  }
}
