import express from "express";
import { processResponses, readAloudStory } from "../controllers/StoryController.js";
import { responseToUser } from "../controllers/UserResponseController.js";
import { retrieveUserName, retrieveUserDetails } from "../controllers/UserController.js";

// Import the controllers for categories and questions
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
} from "../controllers/CategoryController.js";

import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById
} from "../controllers/QuestionController.js";

const router = express.Router();

// User Routes
router.get("/user/retrieveUser", retrieveUserName);
router.get("/user/retrieveUserDetails", retrieveUserDetails);

// Responses Route
router.post("/response/responseToUser", responseToUser);

// Story Routes
router.get("/story/complete/:id", processResponses);
router.get("/story/readAloud/:id", readAloudStory);

// Categories Routes (CRUD)
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategoryById);
router.delete("/categories/:id", deleteCategoryById);

// Questions Routes (CRUD)
router.post("/questions", createQuestion);
router.get("/questions", getAllQuestions);
router.get("/questions/:id", getQuestionById);
router.put("/questions/:id", updateQuestionById);
router.delete("/questions/:id", deleteQuestionById);

export default router;
