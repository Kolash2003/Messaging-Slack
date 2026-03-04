import express from 'express';

import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { getWorkspaceUserIsMemberOfController } from '../../controllers/workspaceController.js';
import { deleteWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { workspaceCreateSchema } from '../../validators/workspace.js';
import { validate } from '../../validators/zodValidator.js';

const workspaceRouter = express.Router();

workspaceRouter.post('/', isAuthenticated, validate(workspaceCreateSchema), createWorkspaceController);
workspaceRouter.get('/', isAuthenticated, getWorkspaceUserIsMemberOfController);
workspaceRouter.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

export default workspaceRouter;