import express from 'express';

import channelRouter from './channel.js';
import memberRouter from './memberRoutes.js';
import userRouter from './users.js';
import workspaceRouter from './workspace.js';

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/workspace', workspaceRouter);
v1Router.use('/channel', channelRouter);
v1Router.use('/member', memberRouter);

export default v1Router;