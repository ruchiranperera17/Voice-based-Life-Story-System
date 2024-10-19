import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.DATABASE; // Ensure your .env file has the correct URI
    if (!uri) {
      throw new Error("MongoDB URI is not defined in the .env file");
    }

    // Attempt to connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
