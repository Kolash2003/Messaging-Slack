import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js"
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

const isUserAdminOfWorkspace = function (workspace, userId) {
    return workspace.members.find(
        member =>
            (member.memberId.toString() === userId ||
                member.memberId._id.toString() === userId) &&
            member.role === 'admin'
    );
}

const isUserMemberOfWorkspace = function (workspace, userId) {
    return workspace.members.find(
        member => (member.memberId.toString() ||
            member.memberId._id.toString()) === userId);
}

const isChannelAlreadyPartOfWorkspace = function (workspace, channelName) {
    return workspace.channels.find(
        channel =>
            channel.name.toLowerCase() === channelName.toLowerCase());
}

export const createWorkspace = async function (workspaceData) {
    try {
        const joinCode = uuidv4().substring(0, 6).toUpperCase();

        const response = await workspaceRepository.create({
            name: workspaceData.name,
            description: workspaceData.description,
            joinCode: joinCode
        });

        await workspaceRepository.addMemberToWorkspace(
            response._id,
            workspaceData.owner,
            'admin'
        );

        const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
            response._id,
            'general'
        );

        return updatedWorkspace;

    } catch (error) {
        console.log('Create workspace service error', error);
        if (error.name === `ValidationError`) {
            throw new ValidationError({
                error: error.errors
            },
                error.message
            );
        }
        if (error.code === 11000 || error.cause?.code === 11000) {
            throw new ValidationError(
                {
                    error: ['A workspace with same details already exists']
                },
                'A workspace with same details already exists'
            );
        }
        throw error;
    }
}


export const getWorkspacesUserIsMemberOfService = async function (userId) {
    try {
        const workspaces = await workspaceRepository.fetAllWorkspaceByMemberId(userId);
        return workspaces;
    } catch (error) {
        console.log('Get workspaces user is member of service error', error);
        throw error;
    }
}

export const deleteWorkspaceService = async function (workspaceId, userId) {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isAllowed = isUserAdminOfWorkspace(workspace, userId);

        if (isAllowed) {
            await channelRepository.deleteMany(workspace.channels);

            const response = await workspaceRepository.delete(workspaceId);
            return response;
        }

        throw new ClientError({
            explanation: "User is either not a member or an admin of the workspace",
            message: "User is not allowed to delete the workspace",
            statusCode: StatusCodes.UNAUTHORIZED
        });

    } catch (error) {
        console.log('Delete workspace service error', error);
        throw error;
    }
}


export const getWorkspaceService = async function (workspaceId, userId) {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember = isUserMemberOfWorkspace(workspace, userId);

        if (!isMember) {
            throw new ClientError({
                explanation: "User is not a member of the workspace",
                message: "User is not allowed to get the workspace",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        return workspace;

    } catch (error) {
        console.log('Get workspace service error', error);
        throw error;
    }
}

export const getWorkspaceDetailsByJoinCodeService = async function (joinCode, userId) {
    try {
        const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember = isUserMemberOfWorkspace(workspace, userId);

        if (!isMember) {
            throw new ClientError({
                explanation: "User is not a member of the workspace",
                message: "User is not allowed to get the workspace",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        return workspace;
    } catch (error) {
        console.log('Get workspace details by join code service error', error);
        throw error;
    }
}


export const updateWorkspaceService = async function (worksapceId, workspaceData, userId) {
    try {
        const workspace = await workspaceRepository.getById(worksapceId);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace, userId);

        if (!isAdmin) {
            throw new ClientError({
                explanation: "User is not an admin of the workspace",
                message: "User is not allowed to update the workspace",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const updatedWorkspace = await workspaceRepository.update(worksapceId, workspaceData);

        return updatedWorkspace;

    } catch (error) {
        console.log('update worksapce service error', error);
        throw error;
    }
}


export const addMemberToWorkspaceService = async function (workspaceId, memberId, role, userId) {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember = isUserMemberOfWorkspace(workspace, memberId);

        if (isMember) {
            throw new ClientError({
                explanation: "User is already a member of the workspace",
                message: "User is not allowed to add the user to the workspace",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace, userId);

        if (!isAdmin) {
            throw new ClientError({
                explanation: "User is not an admin of the workspace",
                message: "User is not allowed to add the user to the workspace",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const response = await workspaceRepository.addMemberToWorkspace(workspaceId, memberId, role);
        return response;
    } catch (error) {
        console.log('addMembertoWorkspaceService error', error);
        throw error;
    }
}

export const addChannelToWorkspaceService = async function (workspaceId, channelName, userId) {
    try {
        const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace, userId);

        if (!isAdmin) {
            throw new ClientError({
                explanation: "User is not an admin of the workspace",
                message: "User is not allowed to add the channel to the workspace",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const isChannelPartofWorkspace = isChannelAlreadyPartOfWorkspace(workspace, channelName);

        if (isChannelPartofWorkspace) {
            throw new ClientError({
                explanation: "Channel is already part of the workspace",
                message: "Channel is not allowed to add the channel to the workspace",
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const response = await workspaceRepository.addChannelToWorkspace(workspaceId, channelName);
        return response;
    } catch (error) {
        console.log('addChannelToWorkspaceService error', error);
        throw error;
    }
}