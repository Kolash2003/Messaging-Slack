import express from 'express';

import { signIn, signUp } from '../../controllers/userController.js';
import { userSignInSchema, userSignUpSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const userRouter = express.Router();

userRouter.post('/signup', validate(userSignUpSchema), signUp)
userRouter.post('/signin', validate(userSignInSchema), signIn)

export default userRouter;