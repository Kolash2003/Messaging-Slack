import { StatusCodes } from "http-status-codes";

import { customErrorResponse } from "../utils/common/responseObjects.js";

export const validate = (schema) => {
    return async (req, res, next) => {
        const result = await schema.safeParseAsync(req.body);
        if (result.success) {
            next();
        } else {
            const explanation = result.error.issues.map((issue) => issue.message);
            res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: 'Validation error',
                explanation: explanation
            }));
        }
    }
}