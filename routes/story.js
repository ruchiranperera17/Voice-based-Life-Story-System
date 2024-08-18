import express from "express";
import { buildCompletedStoryLine, buildStoryNarratives, buildStorySummary } from "../controllers/StoryController.js";
import { getQuestions, catchAnswers } from "../controllers/QuestionController.js";

const router = express.Router();

router.get("/question", getQuestions);
router.post("/answers", catchAnswers);
router.get("/summary", buildStorySummary);
router.get("/narratives", buildStoryNarratives);
router.get("/storyline/:id", buildCompletedStoryLine);

export default router;