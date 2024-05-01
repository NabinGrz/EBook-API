import express from "express";
import { createBook } from "./bookController";
import multer from "multer"; //? FOR USING MULTIPART/FORMDATA
import path from "node:path";
const bookRouter = express.Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/upload"),
  limits: { fieldSize: 1e7 }, //?30MB
});
//ROUTES
bookRouter.post(
  "/",
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

export default bookRouter;
