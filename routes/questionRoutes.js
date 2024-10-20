import express from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById,
} from '../controllers/QuestionController.js';

const router = express.Router();

// Group routes for /questions
router.route('/questions')
    .post(createQuestion)
    .get(getAllQuestions);

// Group routes for /questions/:id
router.route('/questions/:id')
    .get(getQuestionById)
    .put(updateQuestionById)
    .delete(deleteQuestionById);

export default router;
