import express from "express";
import { buildCompletedStoryLine, buildStoryNarratives, buildStorySummary } from "../controllers/StoryController.js";

const router = express.Router();

router.get("/summary", buildStorySummary);
router.get("/narratives", buildStoryNarratives);
router.get("/storyline/:id", buildCompletedStoryLine);

export default router;