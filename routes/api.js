import express from "express";
import { processResponses, buildStoryNarratives, buildStorySummary } from "../controllers/StoryController.js";
import { responseToUser } from "../controllers/UserResponseController.js";
import { retrieveUserName, retrieveUserDetails } from "../controllers/UserController.js";

const router = express.Router();

// User
router.get("/user/retrieveUser", retrieveUserName);
router.get("/user/retrieveUserDetails",  retrieveUserDetails);

// Responses
router.post("/response/responseToUser", responseToUser);

// Story
router.post("/story/complete/:id", processResponses)
router.get("/summary", buildStorySummary);
router.get("/narratives", buildStoryNarratives);
//router.get("/storyline/:id", buildCompletedStoryLine);


export default router;