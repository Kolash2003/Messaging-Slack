import express from "express";

import { getMessagesController } from "../../controllers/messageController.js";
import { isAuthenticated } from "../../middlewares/authMiddlewares.js";

const messageRouter = express.Router();

messageRouter.get('/messages/:channelId', isAuthenticated, getMessagesController)

export default messageRouter;