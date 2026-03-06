import { StatusCodes } from "http-status-codes";

import { createWorkspace, getWorkspaceDetailsByJoinCodeService, getWorkspacesUserIsMemberOfService } from "../services/workspaceService.js";
import { deleteWorkspaceService } from "../services/workspaceService.js";
import { getWorkspaceService } from "../services/workspaceService.js";
import { updateWorkspaceService } from "../services/workspaceService.js";
import { addMemberToWorkspaceService } from "../services/workspaceService.js";
import { addChannelToWorkspaceService } from "../services/workspaceService.js";
import { customErrorResponse } from "../utils/common/responseObjects.js";
import { internalErrorResponse } from "../utils/common/responseObjects.js";
import { successResponse } from "../utils/common/responseObjects.js";

export const createWorkspaceController = async function (req, res) {
    try {
        const response = await createWorkspace({
            ...req.body,
            owner: req.user
        });

        return res
            .status(StatusCodes.CREATED)
            .json(successResponse(response));

    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const getWorkspaceUserIsMemberOfController = async function (req, res) {
    try {
        const response = await getWorkspacesUserIsMemberOfService(req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspaces fetched successfully"));
    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const deleteWorkspaceController = async function (req, res) {
    try {
        const response = await deleteWorkspaceService(req.params.workspaceId, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace deleted successfully"));
    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}


export const getWorkspaceController = async function (req, res) {
    try {

        const response = await getWorkspaceService(req.params.workspaceId, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace fetched successfully"));

    } catch (error) {
        console.log('Get workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const getWorkspaceByJoinCodeController = async function (req, res) {
    try {

        const response = await getWorkspaceDetailsByJoinCodeService(req.params.joinCode, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace fetched successfully"));

    } catch (error) {
        console.log('Get workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const updateWorkspaceController = async function (req, res) {
    try {
        const response = await updateWorkspaceService(req.params.workspaceId, req.body, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace updated successfully"));
    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}


export const addMemberToWorkspaceController = async function (req, res) {
    try {
        const response = await addMemberToWorkspaceService(req.params.workspaceId, req.body.memberId, req.body.role || 'member', req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Member added successfully"));
    } catch (error) {
        console.log('Add member to workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}


export const addChannelToWorkspaceController = async function (req, res) {
    try {
        const response = await addChannelToWorkspaceService(req.params.workspaceId, req.body.channelName, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Channel added successfully"));
    } catch (error) {
        console.log('Add channel to workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}