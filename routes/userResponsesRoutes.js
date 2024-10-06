import express from "express";
import getResponses from "../controllers/UserResponses.js";

const router = express.Router();
router.route("/responses").get(getResponses);

export default router;
