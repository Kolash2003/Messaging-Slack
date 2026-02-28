import express from 'express';

import { signUp } from '../../controllers/userController.js';
import { userSignUpSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const userRouter = express.Router();

userRouter.post('/signup', validate(userSignUpSchema), signUp)

export default userRouter;