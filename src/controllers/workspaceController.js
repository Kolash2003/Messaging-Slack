import { StatusCodes } from "http-status-codes";

import { createWorkspace, getWorkspacesUserIsMemberOfService } from "../services/workspaceService.js";
import { deleteWorkspaceService } from "../services/workspaceService.js";
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