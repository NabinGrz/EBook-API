import express, { Request, Response, NextFunction } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
const app = express();

//ROUTES
//HTTP METHODS

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome the Ebook API'S",
  });
});

//GLOBAL ERROR HANDLER
//***MAKE SURE IS AT LAST OF ROUTES

app.use(globalErrorHandler);

export default app;
