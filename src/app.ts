import express, { Request, Response, NextFunction } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";
const app = express();

//** THIS WILL HELP TO REQUEST FROM MULTIPLE PORT FROM BROWSERS */
app.use(
  cors({
    origin: config.frontendDomain, //? This will allow only the provided domain to request
  })
);
//** THIS NEEDS TO USE TO ENABLE JSON PARSING,, OTHERWISE REEQUEST WILL CRASH */
app.use(express.json());
//ROUTES
//HTTP METHODS

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome the Ebook API'S",
  });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//GLOBAL ERROR HANDLER
//***MAKE SURE IS AT LAST OF ROUTES

app.use(globalErrorHandler);

export default app;
