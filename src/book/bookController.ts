import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  //   const {} = req.body;
  console.log("files", req.files);
  let uploadResult;
  let bookFileUploadResult;
  try {
    //? THIS IS TYPE CASTING TO MULTER
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      filename
    );

    uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    //**------------------------------------------------------ */
    const bookPDFMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilPath = path.resolve(
      __dirname,
      "../../public/data/upload",
      bookFileName
    );

    bookFileUploadResult = await cloudinary.uploader.upload(bookFilPath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: bookPDFMimeType,
    });
  } catch (error) {
    return next(error);
  }

  console.log("files", uploadResult);
  console.log("files", bookFileUploadResult);
  res.json({});
};

export { createBook };
