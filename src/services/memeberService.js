import { StatusCodes } from "http-status-codes";

import { ClientError } from "../middlewares/errorHandler.js";
import { userRepository } from "../repositories/userRepository.js";
import { workspaceRepository } from "../repositories/workspaceRepository.js";
import { isUserMemeberOfWorkspace } from "../utils/workspaceUtils.js";

export const isMemebrPartOfWorkspaceService = async (workspaceId, memberId) => {

    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
        throw new ClientError({
            explanation: 'Workspace not found',
            message: 'Workspace not found',
            statusCode: StatusCodes.NOT_FOUND
        });
    }

    const isUserMember = isUserMemeberOfWorkspace(workspace, memberId);

    if (!isUserMember) {
        throw new ClientError({
            explanation: 'User is not a member of the workspace',
            message: 'User is not a member of the workspace',
            statusCode: StatusCodes.UNAUTHORIZED
        });
    }

    const user = await userRepository.getById(memberId);

    return user;
}