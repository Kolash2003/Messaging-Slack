import express from "express";

import { getMessagesController } from "../../controllers/messageController";
import { isAuthenticated } from "../../middlewares/authMiddlewares";

const messageRouter = express.Router();

messageRouter.get('/messages/:channelId', isAuthenticated, getMessagesController)

export default messageRouter;