import createHttpError from "http-errors";
import userRouter from "./userRouter";
import { Request, Response, NextFunction } from "express";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
import { match } from "assert";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //!VALIDATION
  if (!name || !email || !password) {
    //? RETURNING USING GLOBAL ERROR HANDLER
    const error = createHttpError(400, "All fields are required");
    return next(error);

    //?BELOW CAN BE DONE AS WELL
    // return res.json({ message: "All fields are required" });
  }
  //!DATABASE
  try {
    //   const user = await userModel.findOne({ email: email }); //?IF NAME OF KEY & VALUE ARE SAME
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already registered with this email"
      );
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }
  //!PASSWORD- HASH
  let newUser: User;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }
  try {
    //**JWT TOKEN GENERATE */
    const token = sign(
      {
        sub: newUser._id,
      },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
        algorithm: "HS256", //? THIS IS DEFAULT
      }
    );
    //!PROCESS
    //!RESPONSE
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the JWT Token"));
  }
};
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }
  let user;
  try {
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    return next(createHttpError(500, "Error while trying to login user"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Email or password is incorrect"));
  }

  try {
    //CREATE NEW ACCESS TOKEN
    const token = sign(
      {
        sub: user._id,
      },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
        algorithm: "HS256", //? THIS IS DEFAULT
      }
    );
    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the JWT Token"));
  }
};
export { createUser };
export { loginUser };
