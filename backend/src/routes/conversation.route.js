import express from "express";
import { getOrCreateConversation, getConversations } from "../controllers/conversation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, getOrCreateConversation);
router.get("/", protect, getConversations);

export default router;