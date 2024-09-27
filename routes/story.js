import express from "express";
import { buildCompletedStoryLine, buildStoryNarratives, buildStorySummary } from "../controllers/StoryController.js";
import { responseToUser } from "../controllers/UserResponseController.js";
import { retrieveUserDetails } from "../controllers/UserController.js";

const router = express.Router();

// router.get("/question", getQuestions);
// router.post("/answers", catchAnswers);
router.get("/summary", buildStorySummary);
router.get("/narratives", buildStoryNarratives);
router.get("/storyline/:id", buildCompletedStoryLine);
router.post("/responseToUser", responseToUser);
router.get("/retrieveUser", retrieveUserDetails);

export default router;