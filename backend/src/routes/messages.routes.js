import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);

export default router;


// Implement the message input box
// look a tailwind (gpt) make a good chat input bo
// at the send call senMessage function and pass the text to it
// rise the message to store the beofe the messae
// and show you the message in the chat window by updating the context