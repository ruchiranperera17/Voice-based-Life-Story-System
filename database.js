import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("Database is connected...");
    })
    .catch((error) => {
      throw error;
    });
};

export default connection;
