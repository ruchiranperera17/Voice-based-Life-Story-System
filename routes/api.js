import express from "express";
import { processResponses, readAloudStory } from "../controllers/StoryController.js";
import { responseToUser } from "../controllers/UserResponseController.js";
import { retrieveUserName, retrieveUserDetails } from "../controllers/UserController.js";

const router = express.Router();

// User
router.get("/user/retrieveUser", retrieveUserName);
router.get("/user/retrieveUserDetails",  retrieveUserDetails);

// Responses
router.post("/response/responseToUser", responseToUser);

// Story
router.get("/story/complete/:id", processResponses);
router.get("/story/readAloud/:id", readAloudStory);

export default router;