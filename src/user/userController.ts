import createHttpError from "http-errors";
import userRouter from "./userRouter";
import { Request, Response, NextFunction } from "express";

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

  //!PROCESS
  //!RESPONSE
  res.json({ message: "User Registered" });
};

export { createUser };
