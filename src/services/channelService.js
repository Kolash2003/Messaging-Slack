import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
    try {
        const channel = await channelRepository.getChannelWithWorkspaceDetails(channelId);

        if (!channel || !channel.workspaceId) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Channel not found for the provided ID",
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isUserPartOfWorkspace = isUserMemberOfWorkspace(channel.workspaceId, userId);

        if (!isUserPartOfWorkspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "User is not a member of this workspace and hence cannot access the channel.",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const messages = await messageRepository.getPaginatedMessages({
            channelId: channelId
        },
            1,
            20
        )

        return {
            messages,
            _id: channel._id,
            name: channel.name,
            workspaceId: channel.workspaceId,
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt
        }
    } catch (error) {
        console.log('Get channel by ID service error', error);
        throw error;
    }
}