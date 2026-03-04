import express from 'express';

import userRouter from './users.js';
import workspaceRouter from './workspace.js';

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/workspace', workspaceRouter);

export default v1Router;