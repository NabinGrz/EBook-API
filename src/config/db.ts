import mongoose from "mongoose";
import { config } from "./config";
import { Console, error } from "console";

const connectDB = async () => {
  //** REGISTER LISTENERS BEFORE CONNECTING */
  try {
    mongoose.connection.on("connected", () => {
      console.log("Successfully connected to database");
    });
    mongoose.connection.on("error", (error) => {
      console.log("Error in connecting to database.", error);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Failed to connect to database.", error);
    process.exit(1);
  }
};

export default connectDB;
