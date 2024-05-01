import express from "express";
import { createBook, updateBook } from "./bookController";
import multer from "multer"; //? FOR USING MULTIPART/FORMDATA
import path from "node:path";
import authenticate from "../middlewares/authenticate";
const bookRouter = express.Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/upload"),
  limits: { fieldSize: 1e7 }, //?30MB
});
//ROUTES
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createBook
);
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  updateBook
);

export default bookRouter;
