import express from "express";
import getResponses from "../controllers/UserResponsesController.js";

const router = express.Router();
router.route("/responses").get(getResponses);

export default router;
