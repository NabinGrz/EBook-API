import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";
export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Unauthorized request"));
  }

  try {
    const parsedToken = token.split(" ")[1];

    const decoded = verify(parsedToken, config.jwtSecret as string);
    console.log("decoded", decoded);

    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;

    //** PASS CONTROL TO ANOTHER HANDLER  */
    next();
  } catch (error) {
    return next(createHttpError(401, "Token is expired"));
  }

  //   req.userId = decoded.sub;
};

export default authenticate;
