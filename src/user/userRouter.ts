import express from "express";
import { createUser } from "./userController";
const userRouter = express.Router();

//ROUTES
userRouter.post("/register", createUser);

export default userRouter;
