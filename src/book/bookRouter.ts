import express from "express";
import { createBook } from "./bookController";
const bookRouter = express.Router();

//ROUTES
bookRouter.post("/", createBook);

export default bookRouter;
