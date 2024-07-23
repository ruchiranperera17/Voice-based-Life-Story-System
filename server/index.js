import express from 'express';
import story from './routes/story.js';
import Connection from './database.js';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/story", story);

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    })
});

app.listen(8000, () => {
    console.log("Application is running...");
    Connection();
});