import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  console.log("files", req.files);
  let coverImageUploadResult;
  let bookFileUploadResult;
  try {
    //? THIS IS TYPE CASTING TO MULTER
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const coverImagefilePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      filename
    );

    coverImageUploadResult = await cloudinary.uploader.upload(
      coverImagefilePath,
      {
        filename_override: filename,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );
    //**------------------------------------------------------ */
    const bookPDFMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      bookFileName
    );

    bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: bookPDFMimeType,
    });
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: coverImageUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
    try {
      //**DELETE TEMP FILES */
      await fs.promises.unlink(coverImagefilePath);
      await fs.promises.unlink(bookFilePath);
      res.status(201).json({
        id: newBook._id,
      });
    } catch (error) {
      return next(error);
    }
  } catch (error) {
    return next(error);
  }

  console.log("files", coverImageUploadResult);
  console.log("files", bookFileUploadResult);
  //   res.json({});
};

export { createBook };
