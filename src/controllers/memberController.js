import { StatusCodes } from "http-status-codes";

import { isMemebrPartOfWorkspaceService } from "../services/memeberService";
import { successResponse } from "../utils/commonUtils";
import { customErrorResponse } from "../utils/errorUtils";

export const isMemberPartOfWorkspaceController = async (req, res) => {
    try {
        const response = await isMemebrPartOfWorkspaceService(
            req.params.workspaceId,
            req.user
        );

        return res.status(StatusCodes.OK).json(successResponse(response, 'User is a member of the workspace'));
    } catch (error) {
        console.log('User controller error');
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(customErrorResponse(error));
    }
}