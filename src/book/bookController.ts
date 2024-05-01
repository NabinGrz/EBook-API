import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";
import createHttpError from "http-errors";
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
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }
  const _req = req as AuthRequest;
  //**CHECK IF BOOK IS CREATED BY AUTHOR */
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You cannot update others book"));
  }
  //**CHECK IF IMAGE FIELD EXISTS */
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const coverImagefilePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      filename
    );
    completeCoverImage = `${filename}`;
    // completeCoverImage = `${filename}.${coverImageMimeType}`;
    const coverImageUploadResult = await cloudinary.uploader.upload(
      coverImagefilePath,
      {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );
    completeCoverImage = coverImageUploadResult.secure_url;
    await fs.promises.unlink(coverImagefilePath);
  }

  //**-------------------------------------------- */

  let completeFileName = "";
  if (files.file) {
    const fileMimeType = files.file[0].mimetype.split("/").at(-1);
    const filename = files.file[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      filename
    );
    completeFileName = `${filename}`;
    // completeFileName = `${filename}.${fileMimeType}`;
    const fileUploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-covers",
      format: fileMimeType,
    });
    completeFileName = fileUploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  //**-------------------------------------------- */

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find();
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting list of books"));
  }
};
export { createBook, updateBook, listBooks };
