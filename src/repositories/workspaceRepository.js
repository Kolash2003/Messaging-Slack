import { StatusCodes } from 'http-status-codes';

import User from '../schema/users.js';
import Workspace from '../schema/workspace.js';
import ClientError from '../utils/errors/clientError.js';
import channelRepository from './channelRepository.js';
import crudRepository from './crudRepositories.js';

const workspaceRepository = {
    ...crudRepository(Workspace),

    getWorkspaceDetailsById: async function (workspaceId) {
        const workspace = await Workspace.findById(workspaceId).populate('members.memberId', 'username email avatar')
            .populate('channels');

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspace;
    },

    getWorkspaceByName: async function (workspaceName) {
        const workspace = await Workspace.findOne({ name: workspaceName });

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspace;
    },

    getWorkspaceByJoinCode: async function (joinCode) {
        const workspace = await Workspace.findOne({ joinCode });

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspace;
    },

    addMemberToWorkspace: async function (workspaceId, memberId, role) {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const memberExists = await User.findById(memberId);

        if (!memberExists) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Member not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const memberAlreadyExists = workspace.members.find((member) => member.memberId.toString() === memberId);

        if (memberAlreadyExists) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Member already part of workspace",
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        workspace.members.push({ memberId, role });
        await workspace.save();
        return workspace;
    },

    addChannelToWorkspace: async function (workspaceId, channelName) {
        const workspace = await Workspace.findById(workspaceId).populate('channels');

        if (!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const channelExistsInWorkspace = workspace.channels.find((channel) => channel.name === channelName);

        if (channelExistsInWorkspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Channel already exists",
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const channel = await channelRepository.create({
            name: channelName,
            workspace: workspaceId
        });

        workspace.channels.push(channel);
        await workspace.save();
        return workspace;

    },

    fetAllWorkspaceByMemberId: async function (memberId) {
        const workspaces = await Workspace.find({
            'members.memberId': memberId // this is how you filter on a schema array
        }).populate('members.memberId', 'username email avatar');

        if (!workspaces) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspaces;
    }

};

export default workspaceRepository;