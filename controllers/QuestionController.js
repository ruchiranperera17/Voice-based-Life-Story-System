import mongoose from 'mongoose';
import Question from '../models/question.js'; 
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log('Error connecting to MongoDB:', error));

// Capture user input and respond with follow-up question
export const responseToUser = async (req, res, next)  => {
    const userInput = req.body?.promptInput;

    console.log(userInput);

    const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
    });

    const prompt = userInput;

    const followupQuestion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 50,
    });
    console.log(followupQuestion);

    const result = followupQuestion.choices[0].message.content;
    res.status(200).json(result);
};

// Randomly select and return a question from a predefined list
export const getQuestions = (req, res, next) => {
    const questions = [
        "Can you tell me more about your painting hobbies?",
        "What kind of landscapes and portraits did you enjoy creating?",
        "How often did you practice playing the piano?",
        "What inspired you to start painting and playing the piano?",
        "Can you describe a memorable painting or piano piece you worked on?",
        "Did you have any favorite subjects or themes when painting?",
        "How did your daily piano practice influence your skills?",
        "Were there any particular challenges you faced while painting or playing the piano?",
        "What did you enjoy most about painting and playing the piano?",
        "Did you share your artwork or piano performances with others?"
    ];

    try {
        const randomIndex = Math.floor(Math.random() * questions.length);
        let question = questions[randomIndex];
        res.status(200).json(question);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve question' });
    }
};

// CREATE a new question
export const createQuestion = async (req, res) => {
    try {
        const { text, type, categoryQnsId } = req.body;

        const newQuestion = new Question({
            text,
            type,
            categoryQnsId,
            lastUpdated: new Date().toISOString(),
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
};

// READ all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error retrieving questions:', error);
        res.status(500).json({ error: 'Failed to retrieve questions' });
    }
};

// READ a single question by ID
export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error('Error retrieving question:', error);
        res.status(500).json({ error: 'Failed to retrieve question' });
    }
};

// UPDATE a question by ID
export const updateQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, type, categoryQnsId } = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { text, type, categoryQnsId, lastUpdated: new Date().toISOString() },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
};

// DELETE a question by ID
export const deleteQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
};
