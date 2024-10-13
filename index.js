import express from "express";
import api from "./routes/api.js";
import Connection from "./database.js";
import cors from "cors";

const app = express();

// Enable CORS origin access
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api", api);

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(8080, () => {
  console.log("Application is running...");
  Connection();
});
