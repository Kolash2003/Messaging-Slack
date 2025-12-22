import express from 'express';

import userRouter from './users.js';

const v1Router = express.Router();

v1Router.use('/users', userRouter);

export default v1Router;