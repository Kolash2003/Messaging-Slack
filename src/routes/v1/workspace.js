import express from 'express';

import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { getWorkspaceUserIsMemberOfController } from '../../controllers/workspaceController.js';
import { deleteWorkspaceController } from '../../controllers/workspaceController.js';
import { getWorkspaceController } from '../../controllers/workspaceController.js';
import { getWorkspaceByJoinCodeController } from '../../controllers/workspaceController.js';
import { updateWorkspaceController } from '../../controllers/workspaceController.js';
import { addMemberToWorkspaceController } from '../../controllers/workspaceController.js';
import { addChannelToWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { addChannelToWorkspaceSchema, addMemberToWorkspaceSchema, workspaceCreateSchema } from '../../validators/workspace.js';
import { validate } from '../../validators/zodValidator.js';

const workspaceRouter = express.Router();

workspaceRouter.post('/', isAuthenticated, validate(workspaceCreateSchema), createWorkspaceController);
workspaceRouter.get('/', isAuthenticated, getWorkspaceUserIsMemberOfController);
workspaceRouter.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
workspaceRouter.get('/:workspaceId', isAuthenticated, getWorkspaceController);
workspaceRouter.get('/join/:joinCode', isAuthenticated, getWorkspaceByJoinCodeController);
workspaceRouter.put('/:workspaceId', isAuthenticated, updateWorkspaceController);
workspaceRouter.put('/:workspaceId/members', isAuthenticated, validate(addMemberToWorkspaceSchema), addMemberToWorkspaceController);
workspaceRouter.put('/:workspaceId/channels', isAuthenticated, validate(addChannelToWorkspaceSchema), addChannelToWorkspaceController);

export default workspaceRouter;