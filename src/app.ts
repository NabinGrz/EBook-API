import express, { Request, Response, NextFunction } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
const app = express();

//ROUTES
//HTTP METHODS

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome the Ebook API'S",
  });
});

app.use("/api/users", userRouter);

//GLOBAL ERROR HANDLER
//***MAKE SURE IS AT LAST OF ROUTES

app.use(globalErrorHandler);

export default app;
