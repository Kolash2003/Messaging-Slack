import userRepository from "../repositories/userRepository.js"
import ValidationError from "../utils/errors/validationError.js";

// we can prepare our own error from error class
export const signUpService = async (data) => {
    try {
        const newUser = await userRepository.create(data);
        return newUser;
    } catch (error) {
        console.log("User service error", error);
        if (error.name === `ValidationError`) {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }
        if (error.cause?.code === 11000) {  // Mongoose wraps MongoServerError as MongooseError; the original error (with code 11000) is on error.cause
            throw new ValidationError({
                error: ['A user with same email already exists']
            },
                'A user with same email already exists'
            );
        }
    }
}