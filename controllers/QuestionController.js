import Question from '../models/question.js'; 
import dotenv from 'dotenv';

dotenv.config();

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
