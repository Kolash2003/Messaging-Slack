import express from 'express';
import { StatusCodes } from 'http-status-codes';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    return res.status(StatusCodes.OK).json({ message: "GET /users" });
});

export default userRouter;