import express from "express";

import { isMemberPartOfWorkspaceController } from "../../controllers/memberController.js";
import { isAuthenticated } from "../../middlewares/authMiddlewares.js";

const memberRouter = express.Router();

memberRouter.get('/workspace/:workspaceId', isAuthenticated, isMemberPartOfWorkspaceController);

export default memberRouter;